import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import fg from 'fast-glob';
import {
  CONTENT_DIR,
  MANIFEST_PATH,
  SENTINEL_PATH,
  ASSETS_OUT,
  ENGINE_META_PATH,
  resolveVaultRoot,
} from './resolve-paths.mjs';
import { resolveTemplateId, resolveThemeId } from './resolve-theme.mjs';
import {
  buildVaultIndex,
  resolveAsset,
  vaultPathToContentPath,
  copyAssetFromVault,
} from './resolve-asset.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKIP_DIRS = new Set(['Assets', '.obsidian']);
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

function slugify(name) {
  return name
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function encodeSlug(slug) {
  return slug.split('/').map(encodeURIComponent).join('/');
}

function pageHref(section, slug) {
  return `/${encodeURIComponent(section)}/${encodeSlug(slug)}/`;
}

function pageRoute(page, homePath) {
  if (page.relativePath === homePath) {
    return '/';
  }

  if (!page.section) {
    const segment = path.basename(page.relativePath, '.md');
    return `/${encodeURIComponent(segment)}/`;
  }

  return pageHref(page.section, page.slug);
}

function isSectionIndexFile(section, relativePath) {
  return path.basename(relativePath, '.md') === section;
}

/** Pages default to published; `published: false` (or "false") excludes them. */
function isPublished(frontmatter) {
  if (!frontmatter || frontmatter.published === undefined || frontmatter.published === null) {
    return true;
  }
  const value = frontmatter.published;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value).trim().toLowerCase();
  return !['false', '0', 'no', 'off'].includes(normalized);
}

function normalizeAuthors(authors) {
  if (!authors) return [];
  if (Array.isArray(authors)) {
    return authors.map((a) => String(a).trim()).filter(Boolean);
  }
  return String(authors)
    .split(/,|;|\band\b/i)
    .map((a) => a.trim())
    .filter(Boolean);
}

function isImagePath(relativePath) {
  return IMAGE_EXT.has(path.extname(relativePath).toLowerCase());
}

function makeResolveCtx(vaultRoot, vaultIndex, sourceContentPath) {
  return {
    vaultRoot,
    contentDir: CONTENT_DIR,
    sourceContentPath,
    vaultIndex,
  };
}

function resolveAndCopyAsset(target, ctx, assetMap) {
  const resolved = resolveAsset(target, ctx);
  if (!resolved) return null;
  return copyAssetFromVault(resolved.vaultPath, ctx.vaultRoot, ASSETS_OUT, assetMap);
}

function resolveThumbnail(value, ctx, assetMap, basePath) {
  if (!value) return null;

  let target = String(value).trim();
  const wiki = target.match(/^\[\[([^\]]+)\]\]$/);
  if (wiki) {
    target = wiki[1].split('|')[0].trim();
  }

  const resolved = resolveAsset(target, ctx);
  if (!resolved || !isImagePath(resolved.vaultPath)) return null;

  const publicPath = copyAssetFromVault(resolved.vaultPath, ctx.vaultRoot, ASSETS_OUT, assetMap);
  return publicPath ? `${basePath}${publicPath}` : null;
}

function firstEmbedImage(body, ctx, assetMap, basePath) {
  if (!body) return null;
  const matches = body.matchAll(/!\[\[([^\]]+)\]\]/g);
  for (const match of matches) {
    const target = match[1].split('|')[0].trim();
    const resolved = resolveAsset(target, ctx);
    if (resolved && isImagePath(resolved.vaultPath)) {
      const publicPath = copyAssetFromVault(resolved.vaultPath, ctx.vaultRoot, ASSETS_OUT, assetMap);
      if (publicPath) return `${basePath}${publicPath}`;
    }
  }
  return null;
}

function firstSiblingImage(sourceFile, vaultRoot, assetMap, basePath) {
  const dir = path.dirname(path.join(CONTENT_DIR, sourceFile));
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => {
      const aFeatured = a.startsWith('0_') ? 0 : 1;
      const bFeatured = b.startsWith('0_') ? 0 : 1;
      if (aFeatured !== bFeatured) return aFeatured - bFeatured;
      return a.localeCompare(b);
    });

  if (files.length === 0) return null;

  const contentRelative = path.join(path.dirname(sourceFile), files[0]).replace(/\\/g, '/');
  const vaultPath = path
    .relative(vaultRoot, path.join(CONTENT_DIR, contentRelative))
    .replace(/\\/g, '/');
  const publicPath = copyAssetFromVault(vaultPath, vaultRoot, ASSETS_OUT, assetMap);
  return publicPath ? `${basePath}${publicPath}` : null;
}

function resolvePageThumbnail(page, vaultRoot, vaultIndex, assetMap, basePath) {
  const ctx = makeResolveCtx(vaultRoot, vaultIndex, page.relativePath);
  return (
    resolveThumbnail(page.frontmatter.thumbnail, ctx, assetMap, basePath) ||
    firstEmbedImage(page.body, ctx, assetMap, basePath) ||
    firstSiblingImage(page.relativePath, vaultRoot, assetMap, basePath)
  );
}

function pageSortDate(page) {
  const raw =
    page.frontmatter.date ||
    page.frontmatter.start_date ||
    page.frontmatter.end_date ||
    null;
  return raw ? new Date(raw).getTime() : 0;
}

function sortPagesForSection(pages, sortMode) {
  const copy = [...pages];
  if (sortMode === 'title') {
    copy.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === 'order') {
    copy.sort((a, b) => {
      const orderA = a.frontmatter.order ?? 999;
      const orderB = b.frontmatter.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });
  } else {
    // date (default) — also honors start_date / end_date
    copy.sort((a, b) => {
      const dateA = pageSortDate(a);
      const dateB = pageSortDate(b);
      if (dateA !== dateB) return dateB - dateA;
      const orderA = a.frontmatter.order ?? 999;
      const orderB = b.frontmatter.order ?? 999;
      return orderA - orderB;
    });
  }
  return copy;
}

function contentHref(page, basePath, homePath) {
  if (page.isSectionIndex && page.section) {
    return `${basePath}/${encodeURIComponent(page.section)}/`;
  }
  const route = pageRoute(page, homePath);
  return route === '/' ? `${basePath}/` : `${basePath}${route}`;
}

/** File extensions that should not be treated as bare web domains. */
const ASSET_LINK_EXT = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico',
  'pdf', 'mp4', 'webm', 'csv', 'json', 'html', 'css', 'js', 'ts', 'tsx',
  'mjs', 'cjs', 'yaml', 'yml', 'toml', 'txt', 'zip', 'wasm', 'woff', 'woff2',
]);

/**
 * Turn protocol-less external URLs (www.example.com, obsidian.md) into https://…
 * and resolve relative note paths to site routes when they exist in the vault.
 */
function normalizeMarkdownLinkHref(href, ctx, vaultRoot, pagesByPath, basePath, homePath) {
  const dest = String(href || '').trim();
  if (!dest) return dest;
  if (/^[a-z][a-z0-9+.-]*:/i.test(dest)) return dest;
  if (dest.startsWith('#') || dest.startsWith('?') || dest.startsWith('/')) return dest;

  const resolved = resolveAsset(dest, ctx);
  if (resolved?.vaultPath?.endsWith('.md')) {
    const page = findPageForVaultPath(resolved.vaultPath, vaultRoot, pagesByPath);
    if (page) return contentHref(page, basePath, homePath);
    return dest;
  }

  if (/^www\./i.test(dest)) return `https://${dest}`;

  const domainLike = /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/.*)?$/i.test(dest);
  if (!resolved && domainLike) {
    const host = dest.split('/')[0];
    const ext = host.split('.').pop()?.toLowerCase() || '';
    // Unresolved *.md hosts are treated as Moldova-TLD sites (obsidian.md, lefolio.md).
    if (ext === 'md' || !ASSET_LINK_EXT.has(ext)) {
      return `https://${dest}`;
    }
  }

  return dest;
}

function normalizeNavigationEntries(navigation) {
  if (!navigation) return [];

  if (Array.isArray(navigation)) {
    return navigation
      .map((entry) => {
        if (typeof entry === 'string') {
          return { label: entry };
        }
        if (entry && typeof entry === 'object') {
          const [label, path] = Object.entries(entry)[0];
          return { label, path: path ? String(path) : undefined };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof navigation === 'object') {
    return Object.entries(navigation).map(([label, path]) => ({
      label,
      path: path ? String(path) : undefined,
    }));
  }

  return [];
}

function isSectionFolder(name) {
  if (SKIP_DIRS.has(name) || name.startsWith('.')) return false;
  const fullPath = path.join(CONTENT_DIR, name);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function findPageByRelativePath(pagesByPath, targetPath) {
  const normalized = targetPath.replace(/\\/g, '/');
  if (pagesByPath.has(normalized)) {
    return pagesByPath.get(normalized);
  }

  const basename = path.basename(normalized);
  for (const page of pagesByPath.values()) {
    if (page.relativePath.endsWith(`/${basename}`) || page.relativePath === basename) {
      return page;
    }
  }

  return null;
}

function resolveNavigationItem({ label, path: explicitPath }, pagesByPath, homePath) {
  if (explicitPath) {
    const page = findPageByRelativePath(pagesByPath, explicitPath);
    if (page) {
      return {
        label,
        href: pageRoute(page, homePath),
        type: 'page',
      };
    }
  }

  if (isSectionFolder(label)) {
    return {
      label,
      href: `/${encodeURIComponent(label)}/`,
      type: 'section',
    };
  }

  for (const page of pagesByPath.values()) {
    if (!page.section && path.basename(page.relativePath, '.md') === label) {
      return {
        label,
        href: pageRoute(page, homePath),
        type: 'page',
      };
    }
  }

  const sectionPage = [...pagesByPath.values()].find(
    (page) => page.section && page.slug === slugify(label)
  );
  if (sectionPage) {
    return {
      label,
      href: pageRoute(sectionPage, homePath),
      type: 'page',
    };
  }

  return {
    label,
    href: `/${encodeURIComponent(label)}/`,
    type: 'section',
  };
}

function parseLinkTarget(value) {
  const match = value.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
  if (!match) return null;
  return { target: match[1].trim(), alias: match[2]?.trim() };
}

const ALIGN_VALUES = new Set(['left', 'right', 'center']);

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  return String(value).replace(/\/$/, '');
}

function parseEmbedTarget(value) {
  const parts = value.split('|').map((s) => s.trim()).filter(Boolean);
  const target = parts[0];
  let width = null;
  let align = null;
  let wrap = false;

  for (const token of parts.slice(1)) {
    const lower = token.toLowerCase();
    if (/^\d+$/.test(token)) {
      width = parseInt(token, 10);
    } else if (ALIGN_VALUES.has(lower)) {
      align = lower;
    } else if (lower === 'wrap') {
      wrap = true;
    }
  }

  if (wrap && !align) align = 'right';
  return { target, width, align, wrap };
}

function findPageForVaultPath(vaultPath, vaultRoot, pagesByPath) {
  const contentPath = vaultPathToContentPath(vaultPath, vaultRoot, CONTENT_DIR);
  if (!contentPath) return null;
  return pagesByPath.get(contentPath) || null;
}

function parseMarkdownFile(relativePath, fullPath, section = null) {
  const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
  const baseSlug = slugify(path.basename(relativePath));
  const slug = parsed.data.permalink || baseSlug;

  return {
    section,
    slug,
    relativePath,
    frontmatter: parsed.data,
    body: parsed.content.trim(),
  };
}

function preprocessMarkdown(
  body,
  sourceFile,
  vaultRoot,
  vaultIndex,
  pagesByPath,
  assetMap,
  basePath,
  homePath
) {
  let processed = body;
  const ctx = makeResolveCtx(vaultRoot, vaultIndex, sourceFile);

  processed = processed.replace(/!\[\[([^\]]+)\]\]/g, (_, raw) => {
    const { target, width, align, wrap } = parseEmbedTarget(raw);
    const resolved = resolveAsset(target, ctx);
    if (!resolved) return `\n\n*[Missing embed: ${target}]*\n\n`;

    const { vaultPath } = resolved;

    if (isImagePath(vaultPath)) {
      const publicPath = copyAssetFromVault(vaultPath, vaultRoot, ASSETS_OUT, assetMap) || '';
      const prefix = basePath || '';
      const src = `${prefix}${publicPath}`;
      const alt = path.basename(vaultPath, path.extname(vaultPath)).replace(/[_-]/g, ' ');

      if (!width && !align && !wrap) {
        return `\n\n![${alt}](${src})\n\n`;
      }

      const figureClasses = ['content-figure'];
      if (align) figureClasses.push(`align-${align}`);
      if (wrap) figureClasses.push('wrap');

      const figureStyle = width ? ` style="max-width:${width}px"` : '';
      const imgWidthAttr = width ? ` width="${width}"` : '';

      return `\n\n<figure class="${figureClasses.join(' ')}"${figureStyle}><img src="${src}" alt="${alt}"${imgWidthAttr} loading="lazy" /></figure>\n\n`;
    }

    if (vaultPath.endsWith('.md')) {
      const page = findPageForVaultPath(vaultPath, vaultRoot, pagesByPath);
      if (page) {
        const href = contentHref(page, basePath, homePath);
        const title = page.frontmatter.title || page.slug;
        return `\n\n> **${title}**\n>\n> [Read more](${href})\n\n`;
      }
    }

    const publicPath = copyAssetFromVault(vaultPath, vaultRoot, ASSETS_OUT, assetMap);
    if (publicPath) {
      return `\n\n[${path.basename(vaultPath)}](${basePath}${publicPath})\n\n`;
    }
    return `\n\n*[Missing embed: ${target}]*\n\n`;
  });

  processed = processed.replace(/(?<!!)\[\[([^\]]+)\]\]/g, (_, raw) => {
    const { target, alias } = parseLinkTarget(`[[${raw}]]`);
    const resolved = resolveAsset(target, ctx);
    if (!resolved) return alias || target;

    const { vaultPath } = resolved;

    if (vaultPath.endsWith('.md')) {
      const page = findPageForVaultPath(vaultPath, vaultRoot, pagesByPath);
      if (page) {
        const href = contentHref(page, basePath, homePath);
        return `[${alias || page.frontmatter.title || page.slug}](${href})`;
      }
    }

    const publicPath = copyAssetFromVault(vaultPath, vaultRoot, ASSETS_OUT, assetMap);
    if (publicPath) {
      return `[${alias || path.basename(vaultPath)}](${basePath}${publicPath})`;
    }
    return alias || target;
  });

  // Protocol-less domains (www.x.com, obsidian.md) → https://; relative notes → site routes
  processed = processed.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (full, text, href) => {
    const next = normalizeMarkdownLinkHref(href, ctx, vaultRoot, pagesByPath, basePath, homePath);
    return next === href ? full : `[${text}](${next})`;
  });

  processed = processed
    .replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return processed;
}

function scanPages(config, vaultRoot) {
  const sections = fg
    .sync('*', { cwd: CONTENT_DIR, onlyDirectories: true })
    .filter((d) => !SKIP_DIRS.has(d) && !d.startsWith('.'));

  const rawPages = [];
  const sectionIndexNotes = new Map();

  for (const section of sections) {
    const files = fg.sync('**/*.md', { cwd: path.join(CONTENT_DIR, section) });
    for (const file of files) {
      const relativePath = `${section}/${file}`.replace(/\\/g, '/');
      const fullPath = path.join(CONTENT_DIR, relativePath);
      const parsed = parseMarkdownFile(relativePath, fullPath, section);

      if (!isPublished(parsed.frontmatter)) {
        continue;
      }

      if (isSectionIndexFile(section, relativePath)) {
        sectionIndexNotes.set(section, { ...parsed, isSectionIndex: true });
        continue;
      }

      rawPages.push(parsed);
    }
  }

  const homePath = config.home?.replace(/\\/g, '/');
  const standalonePages = [];

  for (const file of fg.sync('*.md', { cwd: CONTENT_DIR })) {
    const relativePath = file.replace(/\\/g, '/');
    if (relativePath === homePath) continue;
    if (rawPages.some((p) => p.relativePath === relativePath)) continue;

    const fullPath = path.join(CONTENT_DIR, relativePath);
    const parsed = parseMarkdownFile(relativePath, fullPath, null);
    if (!isPublished(parsed.frontmatter)) continue;
    standalonePages.push(parsed);
  }

  let standaloneHomePage = null;

  if (
    homePath &&
    homePath.endsWith('.md') &&
    !rawPages.some((p) => p.relativePath === homePath)
  ) {
    const homeFullPath = path.join(CONTENT_DIR, homePath);
    if (fs.existsSync(homeFullPath)) {
      const parsed = parseMarkdownFile(homePath, homeFullPath, null);
      if (isPublished(parsed.frontmatter)) {
        standaloneHomePage = parsed;
      }
    }
  }

  const allContentPages = [
    ...rawPages,
    ...sectionIndexNotes.values(),
    ...standalonePages,
    ...(standaloneHomePage ? [standaloneHomePage] : []),
  ];
  const pagesByPath = new Map(allContentPages.map((p) => [p.relativePath, p]));
  const vaultIndex = buildVaultIndex(vaultRoot);
  const assetMap = {};
  const basePath = normalizeBasePath(config.site?.basePath);
  const avatarCtx = makeResolveCtx(vaultRoot, vaultIndex, '');

  if (config.author?.avatar) {
    resolveAndCopyAsset(config.author.avatar.replace(/\\/g, '/'), avatarCtx, assetMap);
  }

  const pages = rawPages.map((page) => ({
    ...page,
    title: page.frontmatter.title || page.slug,
    processedBody: preprocessMarkdown(
      page.body,
      page.relativePath,
      vaultRoot,
      vaultIndex,
      pagesByPath,
      assetMap,
      basePath,
      homePath
    ),
  }));

  const processedSectionIndexes = new Map();
  for (const [section, note] of sectionIndexNotes.entries()) {
    processedSectionIndexes.set(section, {
      ...note,
      title: note.frontmatter.title || section,
      processedBody: preprocessMarkdown(
        note.body,
        note.relativePath,
        vaultRoot,
        vaultIndex,
        pagesByPath,
        assetMap,
        basePath,
        homePath
      ),
    });
  }

  const processedStandalonePages = standalonePages.map((page) => ({
    ...page,
    title: page.frontmatter.title || page.slug,
    processedBody: preprocessMarkdown(
      page.body,
      page.relativePath,
      vaultRoot,
      vaultIndex,
      pagesByPath,
      assetMap,
      basePath,
      homePath
    ),
  }));

  const processedStandaloneHomePage = standaloneHomePage
    ? {
        ...standaloneHomePage,
        title: standaloneHomePage.frontmatter.title || standaloneHomePage.slug,
        processedBody: preprocessMarkdown(
          standaloneHomePage.body,
          standaloneHomePage.relativePath,
          vaultRoot,
          vaultIndex,
          pagesByPath,
          assetMap,
          basePath,
          homePath
        ),
      }
    : null;

  pages.sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999;
    const orderB = b.frontmatter.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
    return dateB - dateA;
  });

  const homePage =
    pages.find((p) => p.relativePath === homePath) ?? processedStandaloneHomePage;

  const navSections = sections.map((name) => {
    const indexNote = processedSectionIndexes.get(name) || null;
    const sortMode = indexNote?.frontmatter?.sort || 'date';
    const sectionPages = sortPagesForSection(
      pages.filter((p) => p.section === name),
      sortMode
    );

    return {
      name,
      display: indexNote?.frontmatter?.display || 'list',
      preview: indexNote?.frontmatter?.preview || null,
      index: indexNote
        ? {
            relativePath: indexNote.relativePath,
            title: indexNote.title,
            frontmatter: indexNote.frontmatter,
            processedBody: indexNote.processedBody,
          }
        : null,
      pages: sectionPages.map((p) => ({
        section: p.section,
        slug: p.slug,
        title: p.title,
        subtitle: p.frontmatter.subtitle ? String(p.frontmatter.subtitle) : null,
        href: pageRoute(p, homePath),
        date: p.frontmatter.date || p.frontmatter.start_date || null,
        authors: normalizeAuthors(p.frontmatter.authors),
        venue:
          p.frontmatter.venue ||
          p.frontmatter.journal ||
          p.frontmatter.proceedings ||
          null,
        thumbnail: resolvePageThumbnail(p, vaultRoot, vaultIndex, assetMap, basePath),
        frontmatter: p.frontmatter,
      })),
    };
  });

  const navigation = normalizeNavigationEntries(config.navigation).map((entry) =>
    resolveNavigationItem(entry, pagesByPath, homePath)
  );

  const standaloneRoutes = processedStandalonePages.map((page) => ({
    relativePath: page.relativePath,
    segment: path.basename(page.relativePath, '.md'),
    title: page.title,
    processedBody: page.processedBody,
    href: pageRoute(page, homePath),
  }));

  return {
    generatedAt: new Date().toISOString(),
    template: resolveTemplateId(config),
    theme: resolveThemeId(config),
    config,
    basePath,
    home: homePage
      ? {
          relativePath: homePage.relativePath,
          title: homePage.title,
          processedBody: homePage.processedBody,
        }
      : null,
    navigation,
    sections: navSections,
    standalonePages: standaloneRoutes,
    sectionRoutes: [
      ...sections.map((name) => ({ section: name })),
      ...standaloneRoutes.map((page) => ({ section: page.segment })),
    ],
    pages: pages.map(({ relativePath, section, slug, title, frontmatter, processedBody }) => ({
      relativePath,
      section,
      slug,
      title,
      frontmatter,
      processedBody,
      href: pageRoute({ relativePath, section, slug }, homePath),
    })),
    assets: assetMap,
    authorAvatar: (() => {
      if (!config.author?.avatar) return null;
      const resolved = resolveAsset(config.author.avatar.replace(/\\/g, '/'), avatarCtx);
      if (!resolved) return null;
      const publicPath = assetMap[resolved.vaultPath];
      return publicPath ? `${basePath}${publicPath}` : null;
    })(),
  };
}

function purgeAssetsOut() {
  if (fs.existsSync(ASSETS_OUT)) {
    fs.rmSync(ASSETS_OUT, { recursive: true, force: true });
  }
  fs.mkdirSync(ASSETS_OUT, { recursive: true });
}

function writeSentinel() {
  const content = `// Auto-generated by sync-content — do not edit
export const CONTENT_VERSION = ${Date.now()};
`;
  fs.mkdirSync(path.dirname(SENTINEL_PATH), { recursive: true });
  fs.writeFileSync(SENTINEL_PATH, content);
}

function main() {
  const configPath = path.join(CONTENT_DIR, 'config.yaml');
  if (!fs.existsSync(configPath)) {
    console.error(`config.yaml not found in content directory: ${CONTENT_DIR}`);
    process.exit(1);
  }

  purgeAssetsOut();

  const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
  const vaultRoot = resolveVaultRoot(CONTENT_DIR, config);
  const manifest = scanPages(config, vaultRoot);
  const template = resolveTemplateId(config);
  const theme = resolveThemeId(config);

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  fs.writeFileSync(
    ENGINE_META_PATH,
    JSON.stringify(
      {
        contentDir: CONTENT_DIR,
        vaultRoot,
        basePath: manifest.basePath,
        template,
        theme,
      },
      null,
      2
    )
  );

  writeSentinel();

  console.log(
    `Synced ${manifest.pages.length} pages, ${Object.keys(manifest.assets).length} assets (content: ${CONTENT_DIR}, vault: ${vaultRoot})`
  );
}

main();

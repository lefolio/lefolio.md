import fs from 'fs';
import path from 'path';

const DEFAULT_SKIP_DIRS = new Set(['Assets', '.obsidian']);

export function slugify(name) {
  return name
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function pageHref(section, slug) {
  return `/${slugify(section)}/${slug}/`;
}

/**
 * Site route for a page (no basePath prefix).
 * @param {{ relativePath: string, section?: string | null, slug?: string }} page
 * @param {string} homePath content-relative home note path
 */
export function pageRoute(page, homePath) {
  if (page.relativePath === homePath) {
    return '/';
  }

  if (!page.section) {
    const segment = slugify(path.basename(page.relativePath, '.md'));
    return `/${segment}/`;
  }

  return pageHref(page.section, page.slug);
}

/** Slugified URL segment for a section folder or standalone basename. */
export function sectionSlug(name) {
  return slugify(name);
}

export function normalizeNavigationEntries(navigation) {
  if (!navigation) return [];

  if (Array.isArray(navigation)) {
    return navigation
      .map((entry) => {
        if (typeof entry === 'string') {
          return { label: entry };
        }
        if (entry && typeof entry === 'object') {
          const [label, pathValue] = Object.entries(entry)[0];
          return { label, path: pathValue ? String(pathValue) : undefined };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof navigation === 'object') {
    return Object.entries(navigation).map(([label, pathValue]) => ({
      label,
      path: pathValue ? String(pathValue) : undefined,
    }));
  }

  return [];
}

export function findPageByRelativePath(pagesByPath, targetPath) {
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

export function isExternalHref(value) {
  return /^(https?:|mailto:|tel:)/i.test(String(value || '').trim());
}

export function isSectionFolder(name, contentDir, skipDirs = DEFAULT_SKIP_DIRS) {
  if (!contentDir) return false;
  if (skipDirs.has(name) || name.startsWith('.')) return false;
  const fullPath = path.join(contentDir, name);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

/**
 * Resolve one config navigation entry to `{ label, href, type }`.
 * @param {{ label: string, path?: string }} entry
 * @param {Map<string, object>} pagesByPath
 * @param {string} homePath
 * @param {{ contentDir?: string, sectionFolderLabels?: Set<string> }} [options]
 *   `sectionFolderLabels` overrides fs lookup (for tests).
 */
export function resolveNavigationItem(entry, pagesByPath, homePath, options = {}) {
  const { label, path: explicitPath } = entry;
  const { contentDir, sectionFolderLabels } = options;

  const labelIsSection =
    sectionFolderLabels != null
      ? sectionFolderLabels.has(label)
      : isSectionFolder(label, contentDir);

  if (explicitPath && isExternalHref(explicitPath)) {
    return {
      label,
      href: String(explicitPath).trim(),
      type: 'external',
    };
  }

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

  if (labelIsSection) {
    return {
      label,
      href: `/${slugify(label)}/`,
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
    href: `/${slugify(label)}/`,
    type: 'section',
  };
}

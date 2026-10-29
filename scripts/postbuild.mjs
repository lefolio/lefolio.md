#!/usr/bin/env node
/**
 * After `lefolio build`, check each page's SEO tags and write robots.txt + sitemap.xml.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const configText = fs.readFileSync(path.join(ROOT, 'Content/config.yaml'), 'utf8');
const siteUrl = (configText.match(/^\s*url:\s*["']?([^"'\n#]+)/m)?.[1] ?? 'https://lefolio.md')
  .trim()
  .replace(/\/$/, '');

const warn = (message) => console.warn(`postbuild: ${message}`);

if (!fs.existsSync(OUT)) {
  console.error('postbuild: out/ not found — run `lefolio build` first.');
  process.exit(1);
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_next' ? [] : htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function attr(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&') : '';
}

const pages = [];
for (const file of htmlFiles(OUT)) {
  const relative = path.relative(OUT, path.dirname(file)).split(path.sep).join('/');
  const route = relative === '' || relative === '.' ? '/' : `/${relative}/`;
  const html = fs.readFileSync(file, 'utf8');
  const isPage = path.basename(file) === 'index.html' && !/\/(404|_not-found)\/$/.test(route);
  if (!isPage) continue;

  const title = attr(html, /<title[^>]*>([^<]*)<\/title>/i);
  const description = attr(html, /<meta name="description" content="([^"]*)"/i);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/i);
  const titles = html.match(/<title[\s>]/gi)?.length ?? 0;

  if (titles !== 1) warn(`${route} has ${titles} <title> tags`);
  if (!title.trim()) warn(`${route} is missing a document title`);
  if (!description.trim()) warn(`${route} is missing a meta description`);
  if (canonical !== `${siteUrl}${route === '/' ? '/' : route}`) {
    warn(`${route} canonical is "${canonical || 'missing'}"`);
  }

  pages.push(route);
}

pages.sort((a, b) => a.localeCompare(b));

const escapeXml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const urls = pages
  .map((route) => `  <url>\n    <loc>${escapeXml(siteUrl + (route === '/' ? '/' : route))}</loc>\n  </url>`)
  .join('\n');

fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
fs.writeFileSync(
  path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

console.log(`postbuild: ${pages.length} pages, robots.txt, sitemap.xml`);

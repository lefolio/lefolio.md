import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { resolveContentDir, readEngineMeta } from './scripts/resolve-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');
const stubTemplate = path.join(srcDir, 'lib/templates/no-external.ts');

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  return String(value).replace(/\/$/, '');
}

function readBasePath() {
  const meta = readEngineMeta();
  if (meta?.basePath !== undefined) {
    return normalizeBasePath(meta.basePath);
  }

  const contentDir = resolveContentDir();
  const configPath = path.join(contentDir, 'config.yaml');

  try {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    return normalizeBasePath(config.site?.basePath);
  } catch {
    return '';
  }
}

function resolveExternalTemplateEntry() {
  const root = process.env.LEFOLIO_TEMPLATE_ROOT;
  if (!root) return null;
  for (const name of ['index.ts', 'index.tsx']) {
    const candidate = path.join(root, 'src', name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

const basePath = readBasePath();
const externalTemplateEntry = resolveExternalTemplateEntry();
const activeTemplate = externalTemplateEntry || stubTemplate;

const packageAliases = {
  '@': srcDir,
  'lefolio-active-template': activeTemplate,
  '@lefolio/engine/template': path.join(srcDir, 'lib/templates/public.ts'),
  '@lefolio/engine/markdown': path.join(srcDir, 'components/markdown-public.ts'),
  '@lefolio/engine/globals.css': path.join(srcDir, 'app/globals.css'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Allow compiling site-local `./src` templates outside the engine / cache root.
  ...(externalTemplateEntry ? { experimental: { externalDir: true } } : {}),
  // Next 16 defaults to Turbopack; keep `@/` working for packaged runtimes.
  turbopack: {
    resolveAlias: {
      ...packageAliases,
    },
  },
  // Fallback when building with `--webpack` (e.g. static-export edge cases).
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...packageAliases,
    };
    return config;
  },
};

export default nextConfig;

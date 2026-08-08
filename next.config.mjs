import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { resolveContentDir, readEngineMeta } from './scripts/resolve-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');

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

const basePath = readBasePath();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Next 16 defaults to Turbopack; keep `@/` working for packaged runtimes.
  turbopack: {
    resolveAlias: {
      '@': srcDir,
    },
  },
  // Fallback when building with `--webpack` (e.g. static-export edge cases).
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': srcDir,
    };
    return config;
  },
};

export default nextConfig;

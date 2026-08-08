import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { resolveContentDir, readEngineMeta } from './scripts/resolve-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  // Consumer sites may not install eslint; skip lint during `lefolio build`.
  eslint: { ignoreDuringBuilds: true },
  // Explicit alias so packaged/runtime copies resolve `@/` even when Next
  // does not pick up tsconfig paths (e.g. symlinked node_modules).
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;

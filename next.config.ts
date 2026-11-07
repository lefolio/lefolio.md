import fs from 'fs';
import path from 'path';
import type { NextConfig } from 'next';

function basePath(): string {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), '.content', 'engine.json'), 'utf8');
    const value = JSON.parse(raw).basePath;
    return typeof value === 'string' ? value : '';
  } catch {
    return '';
  }
}

const prefix = basePath();

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(prefix ? { basePath: prefix, assetPrefix: prefix } : {}),
  transpilePackages: ['@lefolio/engine'],
};

export default nextConfig;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ENGINE_ROOT = path.join(__dirname, '..');
export const MANIFEST_PATH = path.join(ENGINE_ROOT, '.content', 'manifest.json');
export const ENGINE_META_PATH = path.join(ENGINE_ROOT, '.content', 'engine.json');
export const SENTINEL_PATH = path.join(ENGINE_ROOT, 'src', 'lib', 'content', 'content-version.ts');
export const ASSETS_OUT = path.join(ENGINE_ROOT, 'public', 'content-assets');
export const ENGINE_OUT = path.join(ENGINE_ROOT, 'out');

/**
 * Resolve content root from --content flag or LEFOLIO_CONTENT env.
 * Defaults to `<cwd>/Content` so thin site starters and the engine repo
 * (when run from its own root) both work without flags.
 */
export function resolveContentDir(argv = process.argv) {
  const flagIndex = argv.indexOf('--content');
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return path.resolve(argv[flagIndex + 1]);
  }
  if (process.env.LEFOLIO_CONTENT) {
    return path.resolve(process.env.LEFOLIO_CONTENT);
  }
  return path.join(process.cwd(), 'Content');
}

export const CONTENT_DIR = resolveContentDir();

/**
 * Walk up from contentDir looking for .obsidian/ (Obsidian vault root).
 */
export function detectVaultRoot(contentDir) {
  let dir = path.resolve(contentDir);
  while (true) {
    if (fs.existsSync(path.join(dir, '.obsidian'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(contentDir);
}

/**
 * Resolve Obsidian vault root for wikilink/embed resolution.
 * Precedence: --vault > LEFOLIO_VAULT > config.vault > auto-detect.
 */
export function resolveVaultRoot(contentDir, config = null, argv = process.argv) {
  const flagIndex = argv.indexOf('--vault');
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return path.resolve(argv[flagIndex + 1]);
  }
  if (process.env.LEFOLIO_VAULT) {
    return path.resolve(process.env.LEFOLIO_VAULT);
  }
  if (config?.vault !== undefined && config?.vault !== null) {
    const value = String(config.vault).trim();
    if (value === '.' || value === './') {
      return path.resolve(contentDir);
    }
    if (path.isAbsolute(value)) {
      return path.resolve(value);
    }
    return path.resolve(contentDir, value);
  }
  return detectVaultRoot(contentDir);
}

export function vaultArgs(argv = process.argv) {
  const idx = argv.indexOf('--vault');
  if (idx !== -1 && argv[idx + 1]) {
    return ['--vault', argv[idx + 1]];
  }
  return [];
}

export function contentEnv(argv = process.argv) {
  const dir = resolveContentDir(argv);
  const vaultFlag = argv.indexOf('--vault');
  const env = {
    ...process.env,
    LEFOLIO_CONTENT: dir,
  };
  if (vaultFlag !== -1 && argv[vaultFlag + 1]) {
    env.LEFOLIO_VAULT = path.resolve(argv[vaultFlag + 1]);
  }
  const templateRoot = resolveTemplateRoot(argv);
  if (templateRoot) {
    env.LEFOLIO_TEMPLATE_ROOT = templateRoot;
  } else {
    delete env.LEFOLIO_TEMPLATE_ROOT;
  }
  return env;
}

/**
 * Find site-local template entry: `<dir>/src/index.ts` or `index.tsx`.
 */
export function findTemplateEntry(dir) {
  for (const name of ['index.ts', 'index.tsx']) {
    const candidate = path.join(dir, 'src', name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Resolve site template root for local `./src` TemplateModule discovery.
 * Precedence: --template > LEFOLIO_TEMPLATE_ROOT > cwd when ./src/index.ts(x) exists.
 * Skips when cwd is the engine package itself (engine `src/` is the Next app).
 */
export function resolveTemplateRoot(argv = process.argv) {
  const flagIndex = argv.indexOf('--template');
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return path.resolve(argv[flagIndex + 1]);
  }
  if (process.env.LEFOLIO_TEMPLATE_ROOT) {
    return path.resolve(process.env.LEFOLIO_TEMPLATE_ROOT);
  }

  const cwd = path.resolve(process.cwd());
  let engineReal;
  try {
    engineReal = fs.realpathSync(ENGINE_ROOT);
  } catch {
    engineReal = path.resolve(ENGINE_ROOT);
  }
  let cwdReal = cwd;
  try {
    cwdReal = fs.realpathSync(cwd);
  } catch {
    // keep cwd
  }
  if (cwdReal === engineReal) {
    return null;
  }

  if (findTemplateEntry(cwd)) {
    return cwd;
  }
  return null;
}

export function readEngineMeta() {
  if (!fs.existsSync(ENGINE_META_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(ENGINE_META_PATH, 'utf8'));
}

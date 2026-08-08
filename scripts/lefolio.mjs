#!/usr/bin/env node
import { spawn } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { contentEnv, ENGINE_ROOT } from './resolve-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Next.js refuses to transpile app source under `node_modules/`, and also
 * mis-detects the app root when a parent folder has package-lock.json.
 * Packaged installs therefore run from a cache dir outside the site tree.
 */
function isPackagedInstall(root) {
  return root.split(path.sep).includes('node_modules');
}

function resolveDepsNodeModules() {
  const candidates = [
    path.join(process.cwd(), 'node_modules'),
    path.join(ENGINE_ROOT, 'node_modules'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'next', 'package.json'))) {
      return dir;
    }
  }
  throw new Error(
    'Could not find next in node_modules. Run npm install in the site (or engine) directory.'
  );
}

function ensureNodeModulesLink(runRoot) {
  const linkPath = path.join(runRoot, 'node_modules');
  const target = resolveDepsNodeModules();
  try {
    const stat = fs.lstatSync(linkPath);
    if (stat.isSymbolicLink() || stat.isDirectory()) {
      fs.rmSync(linkPath, { recursive: true, force: true });
    }
  } catch {
    // missing
  }
  fs.symlinkSync(target, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
}

function syncRuntime(pkgRoot, runRoot) {
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));
  const stampPath = path.join(runRoot, '.engine-version');
  const upToDate =
    fs.existsSync(stampPath) && fs.readFileSync(stampPath, 'utf8').trim() === pkg.version;

  if (!upToDate) {
    fs.mkdirSync(runRoot, { recursive: true });
    const items = [
      'src',
      'scripts',
      'next.config.mjs',
      'postcss.config.mjs',
      'tsconfig.json',
      'next-env.d.ts',
      'package.json',
    ];
    for (const item of items) {
      const from = path.join(pkgRoot, item);
      const to = path.join(runRoot, item);
      if (!fs.existsSync(from)) continue;
      fs.rmSync(to, { recursive: true, force: true });
      fs.cpSync(from, to, { recursive: true });
    }
    // Isolate from parent lockfiles so Next treats this folder as the app root.
    fs.writeFileSync(path.join(runRoot, 'package-lock.json'), '{"lockfileVersion":3,"packages":{}}\n');
    fs.mkdirSync(path.join(runRoot, 'public'), { recursive: true });
    fs.writeFileSync(stampPath, `${pkg.version}\n`);
    console.log(`Prepared LeFolio runtime at ${runRoot} (engine ${pkg.version})`);
  }

  ensureNodeModulesLink(runRoot);
}

function resolveRunRoot() {
  if (!isPackagedInstall(ENGINE_ROOT)) {
    return ENGINE_ROOT;
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(ENGINE_ROOT, 'package.json'), 'utf8'));
  const siteKey = crypto.createHash('sha1').update(process.cwd()).digest('hex').slice(0, 12);
  const runRoot = path.join(os.homedir(), '.cache', 'lefolio', 'runtime', `${pkg.version}-${siteKey}`);
  syncRuntime(ENGINE_ROOT, runRoot);
  return runRoot;
}

function requireFrom(root) {
  return createRequire(path.join(root, 'package.json'));
}

function resolveNextBin(runRoot) {
  try {
    return requireFrom(runRoot).resolve('next/dist/bin/next');
  } catch {
    const fallback = path.join(runRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
    if (fs.existsSync(fallback)) return fallback;
    throw new Error('Could not resolve next binary. Run npm install in the site directory.');
  }
}

function contentArgs(args) {
  const out = [];
  const contentIdx = args.indexOf('--content');
  if (contentIdx !== -1 && args[contentIdx + 1]) {
    out.push('--content', args[contentIdx + 1]);
  }
  const vaultIdx = args.indexOf('--vault');
  if (vaultIdx !== -1 && args[vaultIdx + 1]) {
    out.push('--vault', args[vaultIdx + 1]);
  }
  return out;
}

function stripContentFlag(args) {
  const out = [...args];
  for (const flag of ['--content', '--vault']) {
    const idx = out.indexOf(flag);
    if (idx !== -1) {
      out.splice(idx, 2);
    }
  }
  return out;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function runNext(runRoot, nextArgs, env) {
  const nextBin = resolveNextBin(runRoot);
  return run(process.execPath, [nextBin, ...nextArgs], { cwd: runRoot, env });
}

/** When the CLI is invoked from a consumer site, mirror `out/` into cwd. */
function copyOutToCwd(runRoot) {
  const cwd = path.resolve(process.cwd());
  if (cwd === path.resolve(runRoot)) return;
  const engineOut = path.join(runRoot, 'out');
  if (!fs.existsSync(engineOut)) {
    console.warn(`Build output not found at ${engineOut}`);
    return;
  }
  const dest = path.join(cwd, 'out');
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(engineOut, dest, { recursive: true });
  console.log(`Copied static export to ${dest}`);
}

function withBundlerFlag(args, fallback = '--webpack') {
  const hasWebpack = args.includes('--webpack');
  const hasTurbopack = args.includes('--turbopack');
  if (hasWebpack || hasTurbopack) return args;
  return [...args, fallback];
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const command = rawArgs[0];
  const env = contentEnv(rawArgs);
  const contentFlag = contentArgs(rawArgs);
  const passthrough = stripContentFlag(rawArgs.slice(1));
  const runRoot = resolveRunRoot();

  if (!command || command === '--help' || command === '-h') {
    console.log(`Usage: lefolio <command> [--content <path>] [--vault <path>]

Commands:
  sync    Scan content vault and write manifest
  dev     Sync, watch content, and start Next.js dev server
  build   Sync and run static export

Environment:
  LEFOLIO_CONTENT   Path to site content folder (default: ./Content from cwd)
  LEFOLIO_VAULT     Obsidian vault root for embed/link resolution

Vault root defaults to the nearest ancestor of the content folder that contains
.obsidian/, otherwise the content folder itself. Override with --vault or
config.yaml \`vault:\` when needed.

Bundler (Next 16): defaults to --webpack for reliability with static export.
Pass --turbopack to opt in.

Examples:
  lefolio dev
  lefolio dev --content ~/Documents/MySite
  lefolio build --turbopack
  LEFOLIO_CONTENT=~/Documents/MySite lefolio build
`);
    process.exit(command ? 0 : 1);
  }

  switch (command) {
    case 'sync':
      await run('node', ['scripts/sync-content.mjs', ...contentFlag], { cwd: runRoot, env });
      break;

    case 'build':
      await run('node', ['scripts/sync-content.mjs', ...contentFlag], { cwd: runRoot, env });
      await runNext(runRoot, ['build', ...withBundlerFlag(passthrough)], env);
      copyOutToCwd(runRoot);
      break;

    case 'dev': {
      await run('node', ['scripts/sync-content.mjs', ...contentFlag], { cwd: runRoot, env });
      const watch = spawn('node', ['scripts/watch-content.mjs', ...contentFlag], {
        cwd: runRoot,
        stdio: 'inherit',
        env,
        shell: process.platform === 'win32',
      });
      const nextBin = resolveNextBin(runRoot);
      const next = spawn(
        process.execPath,
        [nextBin, 'dev', ...withBundlerFlag(passthrough)],
        {
          cwd: runRoot,
          stdio: 'inherit',
          env,
          shell: process.platform === 'win32',
        }
      );

      const shutdown = () => {
        watch.kill();
        next.kill();
      };
      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);

      await new Promise((resolve) => {
        next.on('close', resolve);
      });
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

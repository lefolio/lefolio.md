#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import {
  contentEnv,
  ENGINE_OUT,
  ENGINE_ROOT,
} from './resolve-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requireFromEngine = createRequire(path.join(ENGINE_ROOT, 'package.json'));

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

function resolveNextBin() {
  try {
    return requireFromEngine.resolve('next/dist/bin/next');
  } catch {
    const fallback = path.join(ENGINE_ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
    if (fs.existsSync(fallback)) return fallback;
    throw new Error('Could not resolve next binary. Run npm install in the engine package.');
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ENGINE_ROOT,
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

function runNext(nextArgs, env) {
  const nextBin = resolveNextBin();
  return run(process.execPath, [nextBin, ...nextArgs], { env });
}

/** When the CLI is invoked from a consumer site, mirror `out/` into cwd. */
function copyOutToCwd() {
  const cwd = path.resolve(process.cwd());
  const engine = path.resolve(ENGINE_ROOT);
  if (cwd === engine) return;
  if (!fs.existsSync(ENGINE_OUT)) {
    console.warn(`Build output not found at ${ENGINE_OUT}`);
    return;
  }
  const dest = path.join(cwd, 'out');
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(ENGINE_OUT, dest, { recursive: true });
  console.log(`Copied static export to ${dest}`);
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const command = rawArgs[0];
  const env = contentEnv(rawArgs);
  const contentFlag = contentArgs(rawArgs);
  const passthrough = stripContentFlag(rawArgs.slice(1));

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

Examples:
  lefolio dev
  lefolio dev --content ~/Documents/MySite
  lefolio dev --content ./Content --vault ~/Projects/Academic
  LEFOLIO_CONTENT=~/Documents/MySite lefolio build
`);
    process.exit(command ? 0 : 1);
  }

  switch (command) {
    case 'sync':
      await run('node', ['scripts/sync-content.mjs', ...contentFlag], { env });
      break;

    case 'build':
      await run('node', ['scripts/sync-content.mjs', ...contentFlag], { env });
      await runNext(['build', ...passthrough], env);
      copyOutToCwd();
      break;

    case 'dev': {
      await run('node', ['scripts/sync-content.mjs', ...contentFlag], { env });
      const watch = spawn('node', ['scripts/watch-content.mjs', ...contentFlag], {
        cwd: ENGINE_ROOT,
        stdio: 'inherit',
        env,
        shell: process.platform === 'win32',
      });
      const nextBin = resolveNextBin();
      const next = spawn(process.execPath, [nextBin, 'dev', ...passthrough], {
        cwd: ENGINE_ROOT,
        stdio: 'inherit',
        env,
        shell: process.platform === 'win32',
      });

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

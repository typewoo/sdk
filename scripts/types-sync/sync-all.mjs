#!/usr/bin/env node
/**
 * One-command end-to-end sync. For every version in support-window.json:
 *   1. Tear down any running WP+WC.
 *   2. Boot WP+WC pinned to that version (via existing pnpm wp:env:up:minimal).
 *   3. Capture the upstream snapshot.
 * Once all snapshots are fresh, run the diff against the full support window.
 *
 * Usage:
 *   pnpm types:sync:all                   # full window
 *   pnpm types:sync:all --skip <ver>      # skip a specific version (repeatable)
 *   pnpm types:sync:all --only <ver>      # capture only this version, then check
 *   pnpm types:sync:all --no-check        # capture only, skip the diff
 *   pnpm types:sync:all --no-clean        # don't tear down between versions (faster, may stale)
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');

function parseArgs(argv) {
  const args = { skip: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--skip') args.skip.push(argv[++i]);
    else if (a === '--only') args.only = argv[++i];
    else if (a === '--no-check') args.noCheck = true;
    else if (a === '--no-clean') args.noClean = true;
    else if (a.startsWith('--')) console.warn(`[sync-all] ignoring unknown flag ${a}`);
  }
  return args;
}

function loadWindow() {
  const path = join(HERE, 'support-window.json');
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(raw.versions) || raw.versions.length === 0) {
    throw new Error('support-window.json: versions[] is empty');
  }
  return raw;
}

function readAdminPassword() {
  // The wpcli setup writes the password into infra/wordpress/scripts/generated-app-passwords.txt.
  const f = join(REPO_ROOT, 'infra', 'wordpress', 'scripts', 'generated-app-passwords.txt');
  const text = readFileSync(f, 'utf8');
  const m = text.match(/WP_ADMIN_APP_PASSWORD=([^\s#]+)/);
  if (!m) throw new Error(`No WP_ADMIN_APP_PASSWORD in ${f}`);
  return m[1];
}

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  const res = spawnSync(cmd, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...opts.env },
  });
  if (res.status !== 0) {
    throw new Error(`Command failed (exit ${res.status}): ${cmd}`);
  }
}

async function captureOne(version, opts) {
  console.log(`\n========== ${version} ==========`);

  if (!opts.noClean) {
    run('pnpm wp:env:clean');
  }
  run('pnpm wp:env:up:minimal', { env: { WOO_COMMERCE_VERSION: version } });

  // Wait for /wp-json/ to respond (the up:minimal script returns once docker
  // is up, but WP can take a few extra seconds to be reachable).
  console.log('[sync-all] waiting for WP to respond...');
  for (let i = 0; i < 60; i++) {
    try {
      execSync('curl -fs http://localhost:8080/wp-json/ -o /dev/null', {
        stdio: 'ignore',
      });
      break;
    } catch {
      execSync(process.platform === 'win32' ? 'timeout /t 2 /nobreak >nul' : 'sleep 2');
    }
  }

  const password = readAdminPassword();
  run(
    `node scripts/types-sync/cli.mjs capture --base-url http://localhost:8080 --wc-version ${version}`,
    { env: { WP_CONSUMER_KEY: 'admin', WP_CONSUMER_SECRET: password } }
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const window = loadWindow();

  let targets = args.only ? [args.only] : window.versions;
  targets = targets.filter((v) => !args.skip.includes(v));
  if (targets.length === 0) {
    console.error('[sync-all] nothing to capture');
    process.exit(2);
  }

  console.log(`[sync-all] versions to capture: ${targets.join(', ')}`);
  for (const v of targets) {
    await captureOne(v, args);
  }

  if (!args.noCheck) {
    console.log('\n========== diff ==========');
    run('node scripts/types-sync/cli.mjs check');
  }
  console.log('\n[sync-all] done.');
}

main().catch((err) => {
  console.error('\n[sync-all] FAILED:', err.message);
  process.exit(1);
});

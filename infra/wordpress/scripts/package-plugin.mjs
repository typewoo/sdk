#!/usr/bin/env node
import { mkdirSync, cpSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const srcDir = join(ROOT, 'plugins', 'typewoo');
const distDir = join(ROOT, 'dist/plugin');
const stagingDir = join(distDir, 'typewoo');
const zipPath = join(distDir, 'typewoo.zip');

// Ensure dist directory exists and clean staging
mkdirSync(distDir, { recursive: true });
rmSync(stagingDir, { recursive: true, force: true });

// Copy plugin files to staging directory
cpSync(srcDir, stagingDir, { recursive: true });

// Create zip from dist/plugin directory so the zip contains typewoo/ at root
try {
  execFileSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `Push-Location '${distDir}'; Compress-Archive -Path 'typewoo' -DestinationPath '${zipPath}' -Force; Pop-Location`,
    ],
    { stdio: 'inherit' }
  );
  console.log(`[package-plugin] Plugin packaged at: ${zipPath}`);
} catch (error) {
  console.error(
    '[package-plugin] Failed to create zip:',
    error?.message || error
  );
  process.exit(1);
}

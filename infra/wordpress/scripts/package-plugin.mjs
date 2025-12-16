#!/usr/bin/env node
import { mkdirSync, cpSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const srcDir = join(ROOT, 'plugins', 'typewoo');
const distDir = join(ROOT, 'dist/plugin');
const stagingDir = join(distDir, 'typewoo');

// Read version from plugin header
const pluginFile = join(srcDir, 'typewoo.php');
const pluginContent = readFileSync(pluginFile, 'utf-8');
const versionMatch = pluginContent.match(/^\s*\*\s*Version:\s*(.+)$/m);
const version = versionMatch ? versionMatch[1].trim() : 'unknown';

const zipFilename = `typewoo-${version}.zip`;
const zipPath = join(distDir, zipFilename);

console.log(`[package-plugin] Packaging TypeWoo v${version}...`);

// Ensure dist directory exists and clean staging
mkdirSync(distDir, { recursive: true });
rmSync(stagingDir, { recursive: true, force: true });

// Files/directories to exclude from the package
const excludePatterns = [
  'WORDPRESS_SUBMISSION_CHECKLIST.md',
  '.git',
  '.gitignore',
  'node_modules',
  '.DS_Store',
  'Thumbs.db',
];

// Copy plugin files to staging directory, excluding unwanted files
cpSync(srcDir, stagingDir, {
  recursive: true,
  filter: (src) => {
    const basename = src.split(/[\\/]/).pop();
    return !excludePatterns.includes(basename);
  },
});

// Verify plugin-update-checker is included
const pucPath = join(stagingDir, 'plugin-update-checker');
if (!existsSync(pucPath)) {
  console.warn(
    '[package-plugin] Warning: plugin-update-checker not found. Auto-updates will not work.'
  );
}

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
  console.log(`[package-plugin] ✓ Plugin packaged: ${zipPath}`);
  console.log(`[package-plugin] ✓ Version: ${version}`);
} catch (error) {
  console.error(
    '[package-plugin] Failed to create zip:',
    error?.message || error
  );
  process.exit(1);
}

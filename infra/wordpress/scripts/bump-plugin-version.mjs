#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const pluginFile = join(ROOT, 'plugins', 'typewoo', 'typewoo.php');

// Parse command line arguments
const args = process.argv.slice(2);
const bumpType = args[0] || 'patch'; // major, minor, patch, or explicit version

// Read current plugin file
const content = readFileSync(pluginFile, 'utf-8');

// Extract current version from header
const versionHeaderMatch = content.match(/^(\s*\*\s*Version:\s*)(.+)$/m);
if (!versionHeaderMatch) {
  console.error('[bump-version] Could not find Version header in typewoo.php');
  process.exit(1);
}

const currentVersion = versionHeaderMatch[2].trim();
console.log(`[bump-version] Current version: ${currentVersion}`);

// Calculate new version
let newVersion;
if (/^\d+\.\d+\.\d+$/.test(bumpType)) {
  // Explicit version provided
  newVersion = bumpType;
} else {
  const parts = currentVersion.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    console.error(
      `[bump-version] Invalid current version format: ${currentVersion}`
    );
    process.exit(1);
  }

  let [major, minor, patch] = parts;

  switch (bumpType) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor++;
      patch = 0;
      break;
    case 'patch':
      patch++;
      break;
    default:
      console.error(
        `[bump-version] Invalid bump type: ${bumpType}. Use: major, minor, patch, or explicit version (e.g., 1.2.3)`
      );
      process.exit(1);
  }

  newVersion = `${major}.${minor}.${patch}`;
}

console.log(`[bump-version] New version: ${newVersion}`);

// Update version in plugin header
let updatedContent = content.replace(
  /^(\s*\*\s*Version:\s*).+$/m,
  `$1${newVersion}`
);

// Update TYPEWOO_VERSION constant
updatedContent = updatedContent.replace(
  /(define\s*\(\s*'TYPEWOO_VERSION'\s*,\s*')([^']+)('\s*\))/,
  `$1${newVersion}$3`
);

// Write updated content
writeFileSync(pluginFile, updatedContent, 'utf-8');

console.log(`[bump-version] ✓ Updated typewoo.php`);
console.log(
  `[bump-version] ✓ Version bumped: ${currentVersion} → ${newVersion}`
);

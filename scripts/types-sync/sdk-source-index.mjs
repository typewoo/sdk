/**
 * Build a `Map<schemaName, repoRelativeFilePath>` by scanning the type tree
 * for top-level `export const` and `export { … as … }` declarations.
 *
 * Used by report.mjs to render a "Source" link under each route header so
 * developers can click straight to the schema file from the markdown report.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SCHEMA_NAME_RE = /^[A-Z][A-Za-z0-9]*Schema$/;
const EXPORT_CONST_RE = /^\s*export\s+const\s+([A-Za-z0-9_]+)\s*[:=]/gm;
const EXPORT_ALIAS_RE = /\b([A-Za-z0-9_]+)\s+as\s+([A-Za-z0-9_]+)\b/g;

function* walkTs(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walkTs(full);
    } else if (st.isFile() && (name.endsWith('.ts') || name.endsWith('.tsx'))) {
      yield full;
    }
  }
}

/**
 * @param {string} repoRoot
 * @returns {Map<string, string>}  schema name → repo-relative file path (forward slashes)
 */
export function buildSdkSourceIndex(repoRoot) {
  const root = join(repoRoot, 'packages', 'core', 'src', 'lib', 'types');
  const out = new Map();

  for (const file of walkTs(root)) {
    const text = readFileSync(file, 'utf8');
    const rel = relative(repoRoot, file).split('\\').join('/');

    // Direct exports.
    EXPORT_CONST_RE.lastIndex = 0;
    let m;
    while ((m = EXPORT_CONST_RE.exec(text))) {
      const name = m[1];
      if (SCHEMA_NAME_RE.test(name) && !out.has(name)) out.set(name, rel);
    }

    // Re-export aliases like `export { X as Y } from './x.js'`. We resolve
    // `Y` to the importing file so the link still points to the place that
    // surfaces the alias (which is the registry's source of truth).
    EXPORT_ALIAS_RE.lastIndex = 0;
    while ((m = EXPORT_ALIAS_RE.exec(text))) {
      const alias = m[2];
      if (SCHEMA_NAME_RE.test(alias) && !out.has(alias)) out.set(alias, rel);
    }
  }

  return out;
}

/**
 * Route-coverage check. Detects upstream routes the SDK does not model.
 *
 * Pairs with the registry-completeness test (which enforces SDK→upstream
 * mapping). This module enforces the reverse direction: every upstream route
 * must be either registered in schema-map.ts or explicitly allowlisted.
 */

import { readFileSync } from 'node:fs';

/**
 * Load and validate the route allowlist. Missing file → empty allowlist.
 * Each entry must have a non-empty reason and an addedAt date so the
 * allowlist remains auditable rather than becoming a graveyard.
 *
 * @param {string} filePath Absolute path to route-allowlist.json
 * @returns {Set<string>} Set of "surface|route" keys
 */
export function loadRouteAllowlist(filePath) {
  let raw;
  try {
    raw = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return new Set();
    throw err;
  }

  if (!raw || !Array.isArray(raw.entries)) {
    throw new Error('route-allowlist.json: `entries` must be an array');
  }

  const set = new Set();
  for (const entry of raw.entries) {
    if (!entry || typeof entry.surface !== 'string' || !entry.surface) {
      throw new Error(
        'route-allowlist.json: each entry needs a non-empty `surface`'
      );
    }
    if (typeof entry.route !== 'string' || !entry.route) {
      throw new Error(
        `route-allowlist.json: ${entry.surface} entry is missing \`route\``
      );
    }
    if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
      throw new Error(
        `route-allowlist.json: ${entry.surface}|${entry.route} needs a non-empty \`reason\``
      );
    }
    if (typeof entry.addedAt !== 'string' || !entry.addedAt) {
      throw new Error(
        `route-allowlist.json: ${entry.surface}|${entry.route} needs \`addedAt\` (YYYY-MM-DD)`
      );
    }
    set.add(`${entry.surface}|${entry.route}`);
  }
  return set;
}

/**
 * Compare upstream routes against registry coverage and return drift records
 * for any route that is neither registered nor allowlisted. Emits one
 * `route-missing-sdk` record per gap, severity `error`.
 *
 * @param {object} snapshot The captured upstream snapshot
 * @param {Array<{surface: string, route: string}>} registry SCHEMA_MAP entries
 * @param {Set<string>} allowlist Set of "surface|route" keys
 * @returns {Array<object>} Drift records
 */
export function computeRouteCoverage(snapshot, registry, allowlist) {
  const mappedRoutes = new Set(registry.map((e) => `${e.surface}|${e.route}`));
  const drifts = [];
  const surfaces = snapshot?.surfaces ?? {};
  for (const surface of Object.keys(surfaces).sort()) {
    for (const route of Object.keys(surfaces[surface]).sort()) {
      const key = `${surface}|${route}`;
      if (mappedRoutes.has(key)) continue;
      if (allowlist.has(key)) continue;
      drifts.push({
        surface,
        route,
        kind: 'coverage',
        field: '<route>',
        driftKind: 'route-missing-sdk',
        severity: 'error',
        sdk: null,
        upstream: { route },
      });
    }
  }
  return drifts;
}

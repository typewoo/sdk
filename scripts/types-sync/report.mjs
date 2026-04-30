/**
 * Render a DriftReport as JSON + Markdown.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { sortKeysDeep } from './normalise.mjs';

const SEVERITY_ORDER = { error: 0, warn: 1, info: 2 };

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

/**
 * Assign a stable per-severity sequential id (ERROR-001, warn-001, info-001)
 * to every drift in the order they will appear in the markdown table. Mutates
 * the drifts array. Returns the same array for fluent use.
 *
 * Display order: surface → route → severity → field → kind → driftKind.
 * (Mirrors the markdown writer's sort exactly.)
 */
export function assignDriftIds(drifts) {
  const sorted = [...drifts].sort(
    (a, b) =>
      a.surface.localeCompare(b.surface) ||
      a.route.localeCompare(b.route) ||
      (SEVERITY_ORDER[a.severity] ?? 9) -
        (SEVERITY_ORDER[b.severity] ?? 9) ||
      a.field.localeCompare(b.field) ||
      a.kind.localeCompare(b.kind) ||
      a.driftKind.localeCompare(b.driftKind)
  );
  const counters = { error: 0, warn: 0, info: 0 };
  const pad = (n) => String(n).padStart(3, '0');
  for (const d of sorted) {
    counters[d.severity] = (counters[d.severity] ?? 0) + 1;
    d.id = `${idLabel(d.severity)}-${pad(counters[d.severity])}`;
  }
  return drifts;
}

function idLabel(severity) {
  if (severity === 'error') return 'ERROR';
  if (severity === 'warn') return 'WARN';
  return 'INFO';
}

export function writeJson(filePath, drifts, meta) {
  ensureDir(filePath);
  const sorted = [...drifts].sort(
    (a, b) =>
      a.surface.localeCompare(b.surface) ||
      a.route.localeCompare(b.route) ||
      a.kind.localeCompare(b.kind) ||
      a.field.localeCompare(b.field) ||
      a.driftKind.localeCompare(b.driftKind)
  );
  const payload = sortKeysDeep({ meta, drifts: sorted });
  writeFileSync(filePath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

const MAX_CELL_CHARS = 160;

function truncate(s, max = MAX_CELL_CHARS) {
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}

function formatValue(v) {
  if (v == null) return '—';
  if (typeof v === 'object') {
    // Inline objects, but escape pipes so they don't break the markdown
    // table, and truncate long descriptions/payloads.
    const json = JSON.stringify(v).replace(/\|/g, '\\|');
    return '`' + truncate(json) + '`';
  }
  const s = String(v).replace(/\|/g, '\\|');
  return '`' + truncate(s) + '`';
}

function severityIcon(sev) {
  if (sev === 'error') return 'ERROR';
  if (sev === 'warn') return 'warn';
  return 'info';
}

/**
 * Render the reconciler's `provenance` annotations as a compact one-liner
 * for the markdown table. Empty when no annotation is present.
 */
function formatProvenance(p) {
  if (!p || typeof p !== 'object') return '—';
  const parts = [];
  if (p.lastSeenIn) parts.push(`lastSeenIn=${p.lastSeenIn}`);
  if (p.addedIn) parts.push(`addedIn=${p.addedIn}`);
  if (p.matchedIn) parts.push(`matchedIn=${p.matchedIn}`);
  if (p.safeToRemove) parts.push('safeToRemove');
  if (p.acked) parts.push('acked (deprecated)');
  if (p.deprecatedSince) parts.push(`since=${p.deprecatedSince}`);
  return parts.length ? '`' + parts.join(', ') + '`' : '—';
}

export function writeMarkdown(filePath, drifts, meta, opts = {}) {
  const routeFiles = opts.routeFiles ?? {};
  ensureDir(filePath);

  // Group: surface → route → records
  const bySurface = new Map();
  for (const d of drifts) {
    if (!bySurface.has(d.surface)) bySurface.set(d.surface, new Map());
    const byRoute = bySurface.get(d.surface);
    if (!byRoute.has(d.route)) byRoute.set(d.route, []);
    byRoute.get(d.route).push(d);
  }

  const counts = drifts.reduce(
    (acc, d) => ((acc[d.severity] = (acc[d.severity] ?? 0) + 1), acc),
    { error: 0, warn: 0, info: 0 }
  );

  const lines = [];
  lines.push(`# WooCommerce Schema Drift Report`);
  lines.push('');
  lines.push(
    '> Source of truth: the WooCommerce REST API JSON Schema. Every row below is a change the **SDK** needs to make to match upstream — `missing-in-sdk` means add it, `extra-in-sdk` means remove it.'
  );
  lines.push('');
  lines.push(`- WooCommerce version: \`${meta.wcVersion ?? 'unknown'}\``);
  if (meta.supportWindow) {
    lines.push(
      `- Support window: \`${meta.supportWindow.versions.join(', ')}\` (latest: \`${meta.supportWindow.latest}\`)`
    );
  }
  lines.push(`- SDK ref: \`${meta.sdkRef ?? 'local'}\``);
  lines.push(`- Generated: \`${meta.generatedAt}\``);
  lines.push(
    `- Totals: **${counts.error}** error, **${counts.warn}** warn, **${counts.info}** info`
  );
  lines.push('');

  if (drifts.length === 0) {
    lines.push('All schemas are in sync. Nothing to do.');
    writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
    return;
  }

  const sortedSurfaces = [...bySurface.keys()].sort();
  for (const surface of sortedSurfaces) {
    lines.push(`## ${surface}`);
    lines.push('');
    const byRoute = bySurface.get(surface);
    const sortedRoutes = [...byRoute.keys()].sort();
    for (const route of sortedRoutes) {
      // Sort errors first, then warns, then info — within each severity
      // bucket keep the same field's rows grouped (response + request +
      // query for `code`, etc.).
      const records = byRoute
        .get(route)
        .slice()
        .sort(
          (a, b) =>
            (SEVERITY_ORDER[a.severity] ?? 9) -
              (SEVERITY_ORDER[b.severity] ?? 9) ||
            a.field.localeCompare(b.field) ||
            a.kind.localeCompare(b.kind) ||
            a.driftKind.localeCompare(b.driftKind)
        );

      lines.push(`### \`${route}\``);
      const sourceFile = routeFiles[`${surface}|${route}`];
      if (sourceFile) {
        lines.push('');
        lines.push(`Source: [${sourceFile}](${sourceFile})`);
      }
      lines.push('');
      lines.push(
        '| id | severity | kind | field | drift | sdk | upstream | provenance |'
      );
      lines.push('|---|---|---|---|---|---|---|---|');
      for (const r of records) {
        lines.push(
          `| ${r.id ?? ''} | ${severityIcon(r.severity)} | ${r.kind} | \`${
            r.field
          }\` | ${r.driftKind} | ${formatValue(r.sdk)} | ${formatValue(
            r.upstream
          )} | ${formatProvenance(r.provenance)} |`
        );
      }
      lines.push('');
    }
  }

  // Deprecation timeline — fields that no longer exist in `latest` but are
  // still kept in the SDK for back-compat with older supported WC versions.
  // The actionable artifact for "what's safe to drop in the next SDK release".
  const timeline = drifts.filter(
    (d) =>
      d.driftKind === 'removed-in-window' ||
      d.provenance?.acked === true ||
      d.provenance?.safeToRemove === true
  );
  if (timeline.length > 0) {
    lines.push('## Deprecation timeline');
    lines.push('');
    lines.push(
      '> Fields the SDK keeps for back-compat with supported older WC versions, plus fields that have aged out (`safeToRemove`).'
    );
    lines.push('');
    lines.push('| id | surface | route | field | kind | last seen in | status |');
    lines.push('|---|---|---|---|---|---|---|');
    timeline
      .slice()
      .sort(
        (a, b) =>
          a.surface.localeCompare(b.surface) ||
          a.route.localeCompare(b.route) ||
          a.field.localeCompare(b.field)
      )
      .forEach((r) => {
        const lastSeen = r.provenance?.lastSeenIn ?? '—';
        const status = r.provenance?.safeToRemove
          ? 'safeToRemove'
          : r.provenance?.acked
            ? 'acked (deprecated)'
            : 'removed-in-window';
        lines.push(
          `| ${r.id ?? ''} | ${r.surface} | \`${r.route}\` | \`${r.field}\` | ${r.kind} | \`${lastSeen}\` | ${status} |`
        );
      });
    lines.push('');
  }

  writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
}

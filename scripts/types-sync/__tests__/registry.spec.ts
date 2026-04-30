/**
 * Registry-completeness test.
 *
 * Asserts that every Zod schema exported from `packages/core/src/lib/types/`
 * is mapped in `schema-map.ts`. Prevents drift from hiding behind a missing
 * registry row.
 *
 * Mode is controlled by env var:
 *   TYPES_SYNC_REGISTRY=warn   → log unmapped names, don't fail the suite (default)
 *   TYPES_SYNC_REGISTRY=strict → fail on any unmapped admin/store/analytics schema
 */

import { describe, expect, it } from 'vitest';
import { ZodType } from 'zod';

import * as adminTypes from '../../../packages/core/src/lib/types/admin/index.js';
import * as storeTypes from '../../../packages/core/src/lib/types/store/index.js';
import * as analyticsTypes from '../../../packages/core/src/lib/types/analytics/index.js';

import { SCHEMA_MAP } from '../schema-map.js';

const MODE = process.env['TYPES_SYNC_REGISTRY'] ?? 'warn';

function collectExportedSchemas(mod: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [name, value] of Object.entries(mod)) {
    if (!name.endsWith('Schema')) continue;
    if (value instanceof ZodType) out.push(name);
  }
  return out.sort();
}

describe('types-sync registry completeness', () => {
  const mappedNames = new Set(SCHEMA_MAP.map((e) => e.name));

  for (const [surface, mod] of [
    ['admin', adminTypes],
    ['store', storeTypes],
    ['analytics', analyticsTypes],
  ] as const) {
    it(`every exported ${surface} schema is in SCHEMA_MAP`, () => {
      const exported = collectExportedSchemas(mod as Record<string, unknown>);
      const unmapped = exported.filter((n) => !mappedNames.has(n));

      if (unmapped.length === 0) return;

      const msg = `[${surface}] ${unmapped.length} unmapped schema(s):\n  - ${unmapped.join('\n  - ')}`;

      if (MODE === 'strict') {
        expect.fail(msg);
      } else {
        // eslint-disable-next-line no-console
        console.warn(msg);
      }
    });
  }

  it('no duplicate (route, kind, method) tuples', () => {
    const seen = new Map<string, string>();
    for (const e of SCHEMA_MAP) {
      const key = `${e.surface}|${e.route}|${e.kind}|${e.method ?? '-'}`;
      if (seen.has(key)) {
        expect.fail(
          `Duplicate registry entry for ${key}: ${seen.get(key)} and ${e.name}`
        );
      }
      seen.set(key, e.name);
    }
  });
});

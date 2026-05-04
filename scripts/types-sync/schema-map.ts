/**
 * Schema-to-route registry shim.
 *
 * Route metadata now lives co-located in each domain barrel
 * (`packages/core/src/lib/types/admin/{domain}/index.ts`) via
 * `.register(schemaRegistry, { ... })` calls on each Zod schema.
 *
 * This file re-exports the assembled SCHEMA_MAP for backward compatibility
 * with the CLI and test suite. To register a new schema, add a
 * `schemaRegistry.add(...)` call in the relevant domain barrel � no changes
 * needed here.
 */

import { ZodType } from 'zod';

import {
  schemaRegistryEntries,
  type RouteMeta,
  type Surface,
  type Kind,
  type HttpMethod,
} from '../../packages/core/src/lib/types/schema-registry.js';

// Side-effect + name-discovery imports: trigger all schemaRegistry.add() calls
// and provide the export-name lookup for each schema instance.
import * as adminTypes from '../../packages/core/src/lib/types/admin/index.js';
import * as storeTypes from '../../packages/core/src/lib/types/store/index.js';
import * as analyticsTypes from '../../packages/core/src/lib/types/analytics/index.js';

export type { Surface, Kind, HttpMethod };

export interface SchemaMapEntry extends RouteMeta {
  name: string;
  zod: ZodType;
}

function buildSchemaMap(): SchemaMapEntry[] {
  // Build a ZodType → export-name lookup from barrel exports.
  const names = new Map<ZodType, string>();
  for (const mod of [adminTypes, storeTypes, analyticsTypes]) {
    for (const [name, value] of Object.entries(mod)) {
      if (value instanceof ZodType && !names.has(value)) {
        names.set(value, name);
      }
    }
  }

  // Registry is the primary source — iterate it directly.
  const entries: SchemaMapEntry[] = [];
  for (const [zod, meta] of schemaRegistryEntries()) {
    const name = names.get(zod);
    if (!name) continue; // registered but not exported from any barrel — skip
    entries.push({ name, zod, ...meta });
  }
  return entries;
}

export const SCHEMA_MAP: SchemaMapEntry[] = buildSchemaMap();

export function findEntries(zod: ZodType): SchemaMapEntry[] {
  return SCHEMA_MAP.filter((e) => e.zod === zod);
}

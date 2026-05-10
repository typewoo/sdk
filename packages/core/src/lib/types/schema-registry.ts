import { z } from 'zod';

export type Surface = 'admin' | 'store' | 'analytics';
export type Kind = 'response' | 'request' | 'query';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RouteMeta = {
  surface: Surface;
  route: string;
  kind: Kind;
  method?: HttpMethod;
  /**
   * Back-compat acks. Fields listed here are kept in the SDK even though
   * newer WC versions may have removed them. The reconciler downgrades drift
   * on these fields to `info` until they fall outside the support window.
   */
  deprecated?: {
    fields: string[];
    sinceVersion?: string;
    note?: string;
  };
  /**
   * Fields where the SDK intentionally accepts `null` even though the WC
   * JSON Schema declares `nullable: false`. WC's formal schema is incomplete
   * for these fields — the live API returns `null` when they are unset (e.g.
   * `date_expires` on a coupon with no expiry, `stock_quantity` when stock is
   * not tracked). The reconciler downgrades `nullable-mismatch` drift for
   * these fields from `warn` to `info` so the drift gate stays clean.
   */
  knownNullable?: string[];
};

/**
 * Zod 4 typed registry mapping each schema instance to its WC route metadata.
 * Populated by `schemaRegistry.add(schema, { ... })` calls in each domain
 * barrel (`admin/{domain}/index.ts`, etc.). Consumed by the types-sync CLI
 * and schema-map shim — not exported from the SDK public surface.
 */
export const schemaRegistry = z.registry<RouteMeta>();

/**
 * Returns an iterator over all [schema, meta] pairs in the registry.
 * Zod 4's registry is not directly iterable, so this exposes the internal
 * Map via a typed helper.
 */
export function schemaRegistryEntries(): IterableIterator<
  [z.ZodType, RouteMeta]
> {
  const internal = schemaRegistry as unknown as {
    _map: Map<z.ZodType, RouteMeta>;
  };
  if (!(internal._map instanceof Map)) {
    throw new Error(
      'Zod registry internal _map not found — check Zod version compatibility'
    );
  }
  return internal._map.entries();
}

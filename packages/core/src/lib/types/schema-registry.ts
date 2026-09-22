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
  /**
   * Fields where WC's enum depends on site configuration, so the SDK types
   * them as plain strings. E.g. checkout `payment_method` only lists the
   * gateways enabled on the store the snapshot was captured from. The
   * reconciler downgrades `enum-drift` on these fields to `info` as long as
   * the SDK declares no enum.
   */
  openEnums?: string[];
  /**
   * Fields the live API accepts or returns but WC's JSON Schema omits (e.g.
   * checkout `payment_data`, consumed by payment gateways). The reconciler
   * downgrades `extra-in-sdk` drift on these fields (and their nested paths)
   * to `info`.
   */
  undocumented?: string[];
  /**
   * Fields where WC's published type is wrong and the SDK follows what the
   * live API actually sends (e.g. coupon `used_by` is declared as integers
   * but contains guest email addresses too). The reconciler downgrades
   * `type-mismatch` drift on these fields to `info` and shows the reason.
   * Set `driftKinds` to cover other kinds instead, on the field and its
   * children (e.g. `missing-in-sdk` for sub-fields of a mis-described object).
   */
  knownSchemaBugs?: { field: string; reason: string; driftKinds?: string[] }[];
  /**
   * Set (with the reason) when WC publishes no schema for this endpoint, so
   * the SDK schema is hand-written and can't be compared. Without it, a
   * missing upstream schema is reported as a warning because it usually
   * means the route, kind or method here is wrong.
   */
  noUpstreamSchema?: string;
  /**
   * Other routes that use this schema unchanged, e.g. the single-item route
   * of a collection's response (`/products/(?P<id>[\d]+)`). Each is checked
   * against WC exactly like `route`, with the same acknowledgements.
   */
  alsoAt?: string[];
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

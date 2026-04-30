/**
 * Diff engine. Compares one normalised SDK schema against one normalised
 * upstream schema and emits a list of drift records.
 *
 * Source of truth: the upstream WooCommerce JSON Schema. Every drift is
 * framed as "what does the SDK need to do to match WC?" — extras in the SDK
 * are fabrications to be removed; missing fields are gaps to be added. The
 * severity matrix reflects that, not runtime tolerance of looseObject.
 *
 * Severity is purely a function of (driftKind, schemaKind). The engine itself
 * is surface-agnostic.
 */

const SEVERITY = {
  // [response, request, query]
  'missing-in-sdk': { response: 'error', request: 'error', query: 'warn' },
  'extra-in-sdk': { response: 'error', request: 'error', query: 'error' },
  'type-mismatch': { response: 'error', request: 'error', query: 'error' },
  'enum-drift': { response: 'error', request: 'error', query: 'error' },
  'items-enum-drift': { response: 'error', request: 'error', query: 'error' },
  'nullable-mismatch': { response: 'warn', request: 'warn', query: 'warn' },
  'optional-mismatch': { response: 'warn', request: 'error', query: 'info' },
  // Defaults drive behaviour when a caller omits the field, so divergence
  // matters for request/query. Response defaults rarely have user impact.
  'default-mismatch': { response: 'info', request: 'warn', query: 'warn' },
  // Documentation drift — flagged at info severity. These kinds depend on
  // the SDK using `.describe(...)` (Zod runtime metadata); plain JSDoc is
  // stripped before runtime and won't be visible to the diff.
  'description-missing-in-sdk': {
    response: 'info',
    request: 'info',
    query: 'info',
  },
  'description-missing-upstream': {
    response: 'info',
    request: 'info',
    query: 'info',
  },
  'description-mismatch': { response: 'info', request: 'info', query: 'info' },
};

/**
 * Field-path patterns that are part of the WP REST envelope (HATEOAS
 * metadata) rather than the API contract. They never appear in the upstream
 * OPTIONS schema, so flagging them as drift is noise. Filtered out of the
 * SDK side before comparison.
 */
const SDK_EXCLUDE_PATHS = [/^_links(\..+)?$/];

function isExcludedPath(path) {
  return SDK_EXCLUDE_PATHS.some((re) => re.test(path));
}

// SDK call contexts. Admin SDK reads with context=edit; store with view.
// Filtering is applied to upstream response fields before comparison.
const SURFACE_CONTEXT = {
  admin: ['view', 'edit'],
  store: ['view'],
  analytics: ['view', 'edit'],
};

function severityFor(driftKind, schemaKind) {
  return SEVERITY[driftKind]?.[schemaKind] ?? 'warn';
}

function contextOverlaps(field, allowed) {
  if (!field?.context || field.context.length === 0) return true;
  return field.context.some((c) => allowed.includes(c));
}

/**
 * Two field type-shapes are compatible if either side is `any`, the primary
 * types match, or one side's type is contained in the other's union (`types`).
 */
function typesCompatible(s, u) {
  if (s.type === u.type) return true;
  if (s.type === 'any' || u.type === 'any') return true;
  const sTypes = s.types ?? [s.type];
  const uTypes = u.types ?? [u.type];
  if (sTypes.includes(u.type)) return true;
  if (uTypes.includes(s.type)) return true;
  return false;
}

/**
 * Value-equality for default comparison. Primitives compare directly; arrays
 * and plain objects compare by deterministic JSON. We treat `undefined` and
 * the literal absence of a default as equivalent.
 */
function defaultsEqual(a, b) {
  if (a === undefined && b === undefined) return true;
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

/** Skip default-mismatch when neither side declares a default. */
function hasDefault(s, u) {
  return s.default !== undefined || u.default !== undefined;
}

/**
 * Decide whether a description difference is reportable, and what kind.
 * Comparison is exact: any difference in whitespace, casing, or punctuation
 * fires a description-mismatch. WC is the source of truth, so the SDK should
 * carry descriptions byte-for-byte.
 *
 * @returns {{kind: string} | null}
 */
function compareDescriptions(sdkDesc, upDesc) {
  const sdkHas = typeof sdkDesc === 'string' && sdkDesc.length > 0;
  const upHas = typeof upDesc === 'string' && upDesc.length > 0;
  if (!sdkHas && !upHas) return null;
  if (!sdkHas && upHas) return { kind: 'description-missing-in-sdk' };
  if (sdkHas && !upHas) return { kind: 'description-missing-upstream' };
  return sdkDesc === upDesc ? null : { kind: 'description-mismatch' };
}

function setEq(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function arrayDiff(a, b) {
  const A = new Set(a ?? []);
  const B = new Set(b ?? []);
  const onlyA = [...A].filter((x) => !B.has(x)).sort();
  const onlyB = [...B].filter((x) => !A.has(x)).sort();
  return { onlyA, onlyB };
}

/**
 * @param {{
 *   sdk: import('./normalise.mjs').NormalisedSchema,
 *   upstream: import('./normalise.mjs').NormalisedSchema,
 *   surface: 'admin'|'store'|'analytics',
 *   route: string,
 *   kind: 'response'|'request'|'query',
 *   isLoose: boolean,
 *   options?: { checkDescriptions?: boolean },
 * }} args
 */
export function diffPair({
  sdk,
  upstream,
  surface,
  route,
  kind,
  isLoose,
  options,
}) {
  const checkDescriptions = options?.checkDescriptions !== false;
  const drifts = [];
  if (!sdk || !upstream) return drifts;

  const allowedCtx = SURFACE_CONTEXT[surface] ?? ['view', 'edit'];

  // Build context-filtered upstream field map for response shapes.
  const upstreamFields =
    kind === 'response'
      ? Object.fromEntries(
          Object.entries(upstream.fields).filter(([, f]) =>
            contextOverlaps(f, allowedCtx)
          )
        )
      : upstream.fields;

  // Strip WP REST envelope fields (e.g. `_links`) from the SDK side. They're
  // HATEOAS metadata WP adds at runtime, never declared in the OPTIONS schema,
  // so they would otherwise produce permanent extra-in-sdk noise.
  const sdkFields = Object.fromEntries(
    Object.entries(sdk.fields).filter(([path]) => !isExcludedPath(path))
  );

  const allPaths = new Set([
    ...Object.keys(sdkFields),
    ...Object.keys(upstreamFields),
  ]);

  for (const path of [...allPaths].sort()) {
    const s = sdkFields[path];
    const u = upstreamFields[path];

    if (!s && u) {
      drifts.push({
        surface,
        route,
        kind,
        field: path,
        driftKind: 'missing-in-sdk',
        severity: severityFor('missing-in-sdk', kind),
        sdk: null,
        upstream: brief(u),
      });
      continue;
    }
    if (s && !u) {
      drifts.push({
        surface,
        route,
        kind,
        field: path,
        driftKind: 'extra-in-sdk',
        severity: severityFor('extra-in-sdk', kind),
        sdk: brief(s),
        upstream: null,
      });
      continue;
    }

    // Both present — compare attributes.
    if (!typesCompatible(s, u)) {
      // integer ⊂ number — Zod's z.number() emits "number" while WC declares
      // many ID fields as "integer". They're numerically compatible; flag as
      // info so the channel stays usable for genuine type drift.
      const isNumberIntegerPair =
        (s.type === 'number' && u.type === 'integer') ||
        (s.type === 'integer' && u.type === 'number');
      drifts.push({
        surface,
        route,
        kind,
        field: path,
        driftKind: 'type-mismatch',
        severity: isNumberIntegerPair
          ? 'info'
          : severityFor('type-mismatch', kind),
        sdk: typeBrief(s),
        upstream: typeBrief(u),
      });
    }

    if (!setEq(s.enum, u.enum)) {
      // Only flag when at least one side declares an enum.
      if (s.enum || u.enum) {
        const { onlyA: extraInSdk, onlyB: missingInSdk } = arrayDiff(
          s.enum,
          u.enum
        );
        drifts.push({
          surface,
          route,
          kind,
          field: path,
          driftKind: 'enum-drift',
          severity: severityFor('enum-drift', kind),
          sdk: { enum: s.enum ?? null, extraInSdk },
          upstream: { enum: u.enum ?? null, missingInSdk },
        });
      }
    }

    // Compare enums declared on array element shape (items.enum). WC uses
    // this for params like `include_status: array of {string with enum}`.
    if (s.type === 'array' && u.type === 'array') {
      const sItemEnum = itemsEnum(s.items);
      const uItemEnum = itemsEnum(u.items);
      if (!setEq(sItemEnum, uItemEnum) && (sItemEnum || uItemEnum)) {
        const { onlyA: extraInSdk, onlyB: missingInSdk } = arrayDiff(
          sItemEnum,
          uItemEnum
        );
        drifts.push({
          surface,
          route,
          kind,
          field: path,
          driftKind: 'items-enum-drift',
          severity: severityFor('enum-drift', kind),
          sdk: { items: { enum: sItemEnum ?? null }, extraInSdk },
          upstream: { items: { enum: uItemEnum ?? null }, missingInSdk },
        });
      }
    }

    if (s.nullable !== u.nullable) {
      drifts.push({
        surface,
        route,
        kind,
        field: path,
        driftKind: 'nullable-mismatch',
        severity: severityFor('nullable-mismatch', kind),
        sdk: { nullable: s.nullable },
        upstream: { nullable: u.nullable },
      });
    }

    if (s.optional !== u.optional) {
      drifts.push({
        surface,
        route,
        kind,
        field: path,
        driftKind: 'optional-mismatch',
        severity: severityFor('optional-mismatch', kind),
        sdk: { optional: s.optional },
        upstream: { optional: u.optional },
      });
    }

    if (!defaultsEqual(s.default, u.default) && hasDefault(s, u)) {
      drifts.push({
        surface,
        route,
        kind,
        field: path,
        driftKind: 'default-mismatch',
        severity: severityFor('default-mismatch', kind),
        sdk: { default: s.default ?? null },
        upstream: { default: u.default ?? null },
      });
    }

    if (checkDescriptions) {
      const descDrift = compareDescriptions(s.description, u.description);
      if (descDrift) {
        drifts.push({
          surface,
          route,
          kind,
          field: path,
          driftKind: descDrift.kind,
          severity: severityFor(descDrift.kind, kind),
          sdk: { description: s.description ?? null },
          upstream: { description: u.description ?? null },
        });
      }
    }
  }

  return drifts;
}

/**
 * Pull the enum declared on an array's element shape. Tolerates both the
 * legacy normalised form (`items: "string"`) and the new richer form
 * (`items: { type: "string", enum: [...] }`) so old committed snapshots
 * still diff cleanly.
 */
function itemsEnum(items) {
  if (!items || typeof items !== 'object') return undefined;
  return Array.isArray(items.enum) ? items.enum : undefined;
}

/**
 * Pretty-print items for the report. Old snapshots stored items as a string;
 * new ones store an object. Either way we render `string` or `string<enum:7>`
 * to keep report.md compact.
 */
function briefItems(items) {
  if (items == null) return undefined;
  if (typeof items === 'string') return items;
  if (typeof items === 'object') {
    const t = items.type ?? 'any';
    return Array.isArray(items.enum) && items.enum.length
      ? `${t}<enum:${items.enum.length}>`
      : t;
  }
  return undefined;
}

/**
 * Focused brief for type-mismatch rows — just the attributes relevant to a
 * type drift, so the row doesn't carry unrelated noise (optional, nullable,
 * description). Each of those has its own drift kind and renders separately
 * when it actually drifts.
 */
function typeBrief(f) {
  if (!f) return null;
  const out = { type: f.type };
  if (f.types) out.types = f.types;
  if (f.format) out.format = f.format;
  if (f.items) out.items = briefItems(f.items);
  return out;
}

function brief(f) {
  if (!f) return null;
  return {
    type: f.type,
    optional: f.optional,
    nullable: f.nullable,
    enum: f.enum ?? undefined,
    items: briefItems(f.items),
    format: f.format ?? undefined,
    default: f.default,
    // Descriptions are kept verbatim; the markdown writer is responsible for
    // truncating long values to keep tables readable.
    description: f.description ?? undefined,
  };
}

export function summarise(drifts) {
  const counts = { error: 0, warn: 0, info: 0 };
  for (const d of drifts) counts[d.severity] = (counts[d.severity] ?? 0) + 1;
  return counts;
}

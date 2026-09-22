# types-sync

Detects drift between the SDK's Zod schemas and the upstream WooCommerce REST API.

## What it does

For every `(zodSchema, route, kind)` tuple registered in `schema-map.ts`:

1. Loads a snapshot of the upstream WooCommerce REST schema (one big JSON
   document captured per WC version) from `snapshots/wc-<version>.json`.
2. Converts the Zod schema to JSON Schema via `z.toJSONSchema()` (Zod 4).
3. Normalises both sides into the same flat field map.
4. Diffs them, classifying each drift as one of:
   `missing-in-sdk`, `extra-in-sdk`, `type-mismatch`, `enum-drift`,
   `nullable-mismatch`, `optional-mismatch`.
5. Runs the route-coverage check: every upstream route in the latest snapshot
   must be either registered in `schema-map.ts` or explicitly allowlisted in
   `route-allowlist.json`. Unmapped, non-allowlisted routes emit
   `route-missing-sdk` records (severity `error`).
6. Writes `out/drift.json` and `out/drift.md`. Exits non-zero on any `error`
   severity row.

The diff engine is surface-agnostic: admin (`wc/v3`), store (`wc/store/v1`),
and analytics (`wc-analytics`) all flow through the same code path.

## Local usage

Fast path (uses the latest committed snapshot — no docker needed):

```bash
pnpm types:sync:check
```

Full refresh (boots WP+WC, captures, then diffs):

```bash
pnpm types:sync
```

Drop a specific WC version:

```bash
WC_VERSION=9.4.0 pnpm types:sync:capture
pnpm types:sync:check --wc-version 9.4.0
```

List routes the upstream exposes that aren't yet mapped — handy for growing
the registry:

```bash
pnpm types:sync:routes
```

## Adding a new resource

Add a row (or three) to `schema-map.ts`. The completeness test
(`__tests__/registry.spec.ts`) will warn (`TYPES_SYNC_REGISTRY=warn`, default)
or fail (`TYPES_SYNC_REGISTRY=strict`, used in CI) when an exported schema
isn't mapped.

A schema has one registry entry, but many routes share a shape: the
single-item route of a collection, `/duplicate`, every `/batch` response.
List them in `alsoAt: [route, …]` and each is checked against WC like the
main `route`, with the same acknowledgements.

## Acknowledging intentional differences

WooCommerce is the source of truth, but its published schemas aren't always
right. When the SDK deliberately differs, record why on the registry entry
(`schemaRegistry.add(schema, { ... })`) instead of letting drift fail CI.
Each acknowledgement downgrades the matching drift to `info` and is labelled
in the report:

| Field                                               | Use when                                                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `knownNullable: [field]`                            | The live API returns `null` for a field WC declares non-nullable.                                              |
| `openEnums: [field]`                                | WC's enum depends on site configuration (e.g. `payment_method` lists enabled gateways); the SDK uses a string. |
| `undocumented: [field]`                             | The live API accepts or returns a field WC's schema omits (e.g. checkout `payment_data`).                      |
| `knownSchemaBugs: [{ field, reason, driftKinds? }]` | WC's published type is wrong and the SDK follows the live API. `driftKinds` widens it beyond type mismatches.  |
| `noUpstreamSchema: reason`                          | WC publishes no schema for the endpoint at all (e.g. the Store API batch response).                            |
| `deprecated: { fields }`                            | A field is kept for older WC versions in the support window.                                                   |

Some differences are never reported, because WooCommerce's schema carries
no signal for them:

- Path parameters (`id` in `/products/(?P<id>[\d]+)`) in request and query
  shapes: they're part of the URL, not the body.
- Read-only fields in request and query shapes. WP drops them from top-level
  args but leaves them in nested objects (`coupon_lines[].discount_type`).
- Optionality of nested fields when the upstream object doesn't say which of
  its fields are required. WC declares requiredness either JSON-Schema style
  (a `required` list) or WP style (`required: true` on the property); both
  are honoured.
- Nullability against an upstream `any` type.

Array element fields (`line_items[].price`) are only compared when the
snapshot records them; snapshots captured before element walking existed
don't, so re-capture to get element-level drift.

## Exit codes

`check` exits `0` when clean, `1` when drift is found (any `error`, or any
`warn` with `--strict`), and `2` when the tool itself fails (bad arguments,
missing snapshot, crash). CI only files a drift issue on `1`.

## Route allowlist

`route-allowlist.json` lists upstream routes that are intentionally not
modelled by the SDK. Each entry needs:

```json
{
  "surface": "admin",
  "route": "/wc/v3/system_status",
  "reason": "Diagnostics surface, not user-facing SDK target",
  "addedAt": "2026-05-02"
}
```

`reason` and `addedAt` are required. Empty values throw at load time so the
allowlist stays auditable instead of accumulating silent TODOs.

To seed (or refresh) the allowlist after adding a new WC version:

```bash
pnpm types:sync:routes  # prints unmapped surface+route pairs
```

Paste each line you intend to skip into `route-allowlist.json` with a real
reason. Anything left out becomes a `route-missing-sdk` error in the report.

To bypass the coverage check for an ad-hoc run (e.g. while migrating a
surface), pass `--no-coverage-check` to the `check` subcommand.

## Files

| File                   | Role                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `cli.mjs`              | Entry point. Subcommands: `capture`, `check`, `list-routes`.      |
| `capture-upstream.mjs` | Fetches per-surface discovery JSON from a running WP+WC instance. |
| `introspect-zod.mjs`   | `z.toJSONSchema` → normalised shape.                              |
| `normalise.mjs`        | Shared normaliser used by both sides + `sortKeysDeep`.            |
| `diff.mjs`             | Pure diff engine + severity matrix.                               |
| `report.mjs`           | JSON + Markdown writers.                                          |
| `schema-map.ts`        | The registry — only manual seam.                                  |
| `route-allowlist.json` | Upstream routes intentionally not modelled by the SDK.            |
| `route-coverage.mjs`   | Allowlist loader + coverage diff (upstream→SDK direction).        |
| `snapshots/wc-*.json`  | Committed upstream snapshots, one per WC version.                 |
| `out/drift.{json,md}`  | Generated report (gitignored).                                    |

## Why not codegen?

Our Zod schemas carry hand-written JSDoc, conventions, and runtime
`looseObject` semantics that aren't easily round-tripped from JSON Schema.
This tool **compares and notifies**; updates remain a deliberate human edit.

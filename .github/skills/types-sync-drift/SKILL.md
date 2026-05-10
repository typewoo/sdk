---
name: types-sync-drift
description: Guides work with the types-sync drift detection system. Use when running pnpm run types:sync:local, interpreting drift output, resolving nullable-mismatch or other drift warnings, adding new schema registrations, or understanding why WC's OPTIONS schema disagrees with live API responses.
---

# Types-Sync Drift Detection

## When to Use

- Running `pnpm run types:sync:local` and needing to interpret the output
- Resolving any drift kind: `nullable-mismatch`, `missing-in-sdk`, `extra-in-sdk`, `type-mismatch`, `enum-drift`, `optional-mismatch`, `default-mismatch`, or `description-*`
- Adding a new domain schema to the registry (new admin or store endpoint coverage)
- Understanding why WC's OPTIONS schema disagrees with a live GET response
- Adding `knownNullable` or `deprecated` acknowledgements
- Investigating what a snapshot field value means

**When NOT to use:** Changes to interceptors, services, or SDK runtime code that have nothing to do with schema drift.

---

## Overview

The types-sync system keeps SDK Zod schemas in sync with the upstream WooCommerce REST API. It works in two stages:

1. **`capture`** — Fetches the WC discovery document (via OPTIONS requests on a running WC instance) and writes a normalised field-level snapshot to `scripts/types-sync/snapshots/wc-<version>.json`.
2. **`check`** — Loads the snapshot, introspects every registered Zod schema, runs the diff engine field-by-field, and writes `scripts/types-sync/out/drift.{json,md}`. Exits `1` if any `error`-severity drift exists.

The current support window (which WC versions are tested) is in `scripts/types-sync/support-window.json`.

### Key Files Map

| File                                                     | Purpose                                                                                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/types-sync/cli.mjs`                             | CLI entry point. Subcommands: `capture`, `check`, `list-routes`. Parse flags and orchestrate the pipeline.                                        |
| `scripts/types-sync/capture-upstream.mjs`                | Fetches OPTIONS for admin/store/analytics surfaces. Writes the normalised snapshot.                                                               |
| `scripts/types-sync/normalise.mjs`                       | `coerceType()`, `describeNode()`, `normaliseJsonSchema()`. Converts both WC JSON Schema and Zod-derived JSON Schema into the same flat field map. |
| `scripts/types-sync/diff.mjs`                            | `diffPair()`, `summarise()`. Compares SDK field map vs upstream field map and emits drift records. Contains the `SEVERITY` matrix.                |
| `scripts/types-sync/reconcile.mjs`                       | `reconcileAcrossVersions()`. Cross-version reconciliation + `knownNullable` and `deprecated` ack application.                                     |
| `scripts/types-sync/introspect-zod.mjs`                  | Converts a Zod schema instance to a JSON Schema representation for the diff engine.                                                               |
| `scripts/types-sync/schema-map.ts`                       | Builds `SchemaMapEntry[]` from the Zod registry. Side-effect imports trigger all `schemaRegistry.add()` calls.                                    |
| `scripts/types-sync/report.mjs`                          | Writes `out/drift.json` and `out/drift.md`. Assigns stable drift IDs.                                                                             |
| `scripts/types-sync/route-coverage.mjs`                  | Allowlist-backed enforcement: every upstream route must be mapped to a schema or explicitly ignored.                                              |
| `scripts/types-sync/support-window.json`                 | `{ "versions": ["10.7.0"], "latest": "10.7.0" }`. Controls which WC versions are in the diff window.                                              |
| `scripts/types-sync/snapshots/`                          | Captured WC snapshot files (e.g., `wc-local.json`, `wc-10.7.0.json`).                                                                             |
| `scripts/types-sync/out/`                                | Generated drift output: `drift.json` (machine-readable) and `drift.md` (human-readable).                                                          |
| `packages/core/src/lib/types/schema-registry.ts`         | `schemaRegistry` (Zod 4 typed registry) + `RouteMeta` type + `schemaRegistryEntries()` iterator.                                                  |
| `packages/core/src/lib/types/admin/{domain}/index.ts`    | Domain barrel: `schemaRegistry.add()` calls + re-exports.                                                                                         |
| `packages/core/src/lib/types/admin/{domain}/*.schema.ts` | Zod schema definitions for a domain.                                                                                                              |

---

## Running the Tool

### Primary command (captures + checks in one step)

```bash
pnpm run types:sync:local
```

Requires a running WC instance at `http://localhost:8080`. Use `pnpm run wp:env:up` to start Docker Compose WordPress if needed.

Expected output summary line at the end:

```
N error / M warn / P info
```

- Exit `0` — no `error`-severity drift (warns and infos are non-fatal by default).
- Exit `1` — at least one `error`-severity drift.

### Capture only (refresh snapshot from a running WC instance)

```bash
node scripts/types-sync/cli.mjs capture --base-url http://localhost:8080 --wc-version 10.7.0
```

Writes `scripts/types-sync/snapshots/wc-10.7.0.json`.

### Check only (diff against an existing snapshot)

```bash
node scripts/types-sync/cli.mjs check
# or against a specific snapshot:
node scripts/types-sync/cli.mjs check --snapshot scripts/types-sync/snapshots/wc-10.7.0.json
```

### List unmapped routes (find gaps in schema coverage)

```bash
node scripts/types-sync/cli.mjs list-routes
```

Dumps upstream routes that have no registered schema — useful for prioritizing new coverage.

### Useful flags

| Flag                  | Effect                                                            |
| --------------------- | ----------------------------------------------------------------- |
| `--base-url <url>`    | WP base URL (default: `http://localhost:8080`)                    |
| `--wc-version <ver>`  | WC version label for the snapshot filename                        |
| `--snapshot <path>`   | Override snapshot path for `check`                                |
| `--strict`            | Also fail (exit 1) on `warn`-severity rows                        |
| `--json`              | Emit JSON to stdout instead of writing files (`check` only)       |
| `--no-coverage-check` | Skip route-coverage allowlist enforcement                         |
| `--no-endpoint-check` | Suppress warnings for SDK schemas with no matching upstream route |

---

## Reading Drift Output

After running `check`, two files are written:

- `scripts/types-sync/out/drift.md` — human-readable, organized by surface/route/field.
- `scripts/types-sync/out/drift.json` — machine-readable array of `DriftRecord` objects.

Each `DriftRecord` has: `surface`, `route`, `kind` (response/request/query), `field`, `driftKind`, `severity`, `sdk` (SDK value), `upstream` (WC value), optional `provenance`.

### Drift Kind Reference

| Drift Kind                     | Default Severity (response / request / query) | Meaning                                                                            |
| ------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| `missing-in-sdk`               | error / error / warn                          | Field exists in WC upstream but not in the SDK Zod schema.                         |
| `extra-in-sdk`                 | error / error / error                         | Field exists in SDK Zod schema but not in upstream WC. SDK is fabricating a field. |
| `type-mismatch`                | error / error / error                         | Primary type disagrees (e.g., SDK says `string`, WC says `integer`).               |
| `enum-drift`                   | error / error / error                         | Enum values differ between SDK and WC.                                             |
| `items-enum-drift`             | error / error / error                         | Enum values on array items differ.                                                 |
| `nullable-mismatch`            | warn / warn / warn                            | SDK marks field nullable but WC schema does not (or vice versa).                   |
| `optional-mismatch`            | warn / error / info                           | `required` status disagrees between SDK and WC.                                    |
| `default-mismatch`             | info / warn / warn                            | Default value differs. Matters more for request/query (drives caller behavior).    |
| `description-missing-in-sdk`   | info / info / info                            | WC has a description; SDK `.describe()` call is missing or empty.                  |
| `description-missing-upstream` | info / info / info                            | SDK has a description; WC upstream does not.                                       |
| `description-mismatch`         | info / info / info                            | Descriptions differ.                                                               |

**Severity meanings:**

- `error` — Blocks the CI gate. Must be resolved before merging. Exit code 1.
- `warn` — Surfaces for review. Non-fatal by default (fatal with `--strict`). Indicates a schema gap that should be understood.
- `info` — Acknowledged / informational. Either explicitly acked via `knownNullable`/`deprecated`, or low-impact (description-only drift).

The `SEVERITY` matrix is the source of truth: `scripts/types-sync/diff.mjs` → `const SEVERITY = { ... }`.

---

## Resolving Each Drift Kind

For every resolution, the verify step is the same:

```bash
pnpm run types:sync:local
# Confirm the drift kind no longer appears (or drops to info)
```

### `missing-in-sdk`

**Cause:** The WC API exposes a field that has no corresponding property in the SDK Zod schema.

**Files to check:** `packages/core/src/lib/types/admin/{domain}/{domain}.schema.ts` (or `.response.schema.ts`).

**Fix:** Add the field to the Zod schema:

```typescript
// Before — field absent
export const AdminCouponSchema = z.object({
  id: z.number(),
  code: z.string(),
});

// After — field added
export const AdminCouponSchema = z.object({
  id: z.number(),
  code: z.string(),
  amount: z.string(), // ← added
});
```

Use the upstream type shown in `drift.md` to pick the right Zod type. See [Type Mapping](#type-mapping) below.

### `extra-in-sdk`

**Cause:** The SDK Zod schema contains a field that WC no longer exposes. The SDK is fabricating a field.

**Two options:**

1. **Remove the field** if it's genuinely gone and no older WC version in the support window still has it.
2. **Add a `deprecated` ack** (see [Ack Mechanisms](#ack-mechanisms)) if the field still exists in an older supported WC version and removing it would break older clients.

**Note:** If the field has been removed in the `latest` WC version but is present in an older window version, `reconcile.mjs` automatically downgrades this to `info` with `driftKind: 'removed-in-window'`. In that case no action is needed until the older version leaves the support window.

### `type-mismatch`

**Cause:** The Zod type doesn't match what `normalise.mjs` produces for the upstream field. Common cases:

- WC declares `integer`; SDK uses `z.string()` → fix to `z.number().int()`
- WC declares `date-time` (normalised to `string`); SDK uses `z.date()` → fix to `z.string()`
- Note: `z.number()` and `z.number().int()` are **both** compatible with WC `integer` — the diff treats `number` and `integer` as interchangeable.

**Fix:** Update the Zod type to match the upstream type from `drift.md`.

#### Type Mapping

| WC type (upstream)                                | Zod equivalent                       |
| ------------------------------------------------- | ------------------------------------ |
| `string` / `date-time` / `uri` / `email` / `uuid` | `z.string()`                         |
| `integer` / `int`                                 | `z.number()` (or `z.number().int()`) |
| `number` / `float`                                | `z.number()`                         |
| `boolean` / `bool`                                | `z.boolean()`                        |
| `array`                                           | `z.array(...)`                       |
| `object`                                          | `z.object(...)`                      |
| `any` / `mixed`                                   | `z.unknown()`                        |

### `enum-drift`

**Cause:** The Zod enum doesn't include all values that WC exposes, or includes values WC doesn't have.

**Fix:** Update the Zod enum to match upstream:

```typescript
// drift.md shows upstream enum: ["active", "inactive", "pending-payment", "failed"]
// SDK had: ["active", "inactive"]
export const statusEnum = z.enum([
  'active',
  'inactive',
  'pending-payment',
  'failed',
]);
```

### `nullable-mismatch`

See the full [Nullable Mismatch Deep Dive](#nullable-mismatch-deep-dive) section — this drift kind has four distinct root causes, each requiring a different diagnostic approach.

Short version: in most cases, the fix is adding the field to `knownNullable` in the domain barrel's `schemaRegistry.add()` call.

### `optional-mismatch`

**Cause:** The `required` status disagrees between SDK and WC.

- `response` / `request` — `warn` (non-fatal) if SDK marks optional but WC marks required, `error` if SDK marks required but WC marks optional.
- `query` — `info` (always low impact for query params).

**Fix options:**

- If the SDK wrongly marks a response field as required: add `.optional()` to the Zod property.
- If the SDK wrongly marks a response field as optional when WC requires it: remove `.optional()`.
- For request schemas, stricter: align exactly with WC's required list.

### `default-mismatch`

**Cause:** The Zod `.default()` value differs from the upstream default.

**Severity:** `info` for response (low impact), `warn` for request/query (affects caller behavior when a field is omitted).

**Fix:** Update the `.default(...)` value to match `upstream` value shown in `drift.md`, or remove the default if WC has none.

### `description-missing-in-sdk`, `description-missing-upstream`, `description-mismatch`

**Severity:** Always `info`. Rarely requires action.

**Fix:** If you want to resolve: add `.describe('...')` to the relevant Zod property. The description must be set at the Zod runtime level (not JSDoc — JSDoc is stripped before runtime and is invisible to the diff).

---

## Nullable Mismatch Deep Dive

`nullable-mismatch` is the hardest drift kind. The WC JSON Schema frequently declares `nullable: false` for fields that the live API returns as `null`. Do not trust the OPTIONS schema as the authority on nullability — **live GET response is ground truth**.

### Diagnostic: Reading the Snapshot

Before choosing a fix, inspect the captured snapshot. The snapshot path for a field is:

```
snap.surfaces.<surface>["<route>"].response.fields["<fieldName>"].nullable
```

For example, for `date_expires` on `/wc/v3/coupons`:

```json
// scripts/types-sync/snapshots/wc-local.json
{
  "surfaces": {
    "admin": {
      "/wc/v3/coupons": {
        "response": {
          "fields": {
            "date_expires": {
              "type": "string",
              "nullable": false,   // ← WC schema declares non-nullable
              ...
            }
          }
        }
      }
    }
  }
}
```

> **Warning — wrong path:** The snapshot does NOT have `response.schema.properties`. The correct path is always `response.fields`. Using the wrong path will show `undefined` and lead to incorrect conclusions.

If `nullable: false` in the snapshot but the live API returns `null`, this is a WC schema inconsistency — not an SDK bug.

### Four Categories of Nullable Mismatch

#### Category 1 — POST args declare `type: ["null", "string"]` but `schema.properties` does not

**Affected fields:** `date_expires`, `date_expires_gmt`, `date_on_sale_from`, `date_on_sale_from_gmt`, `date_on_sale_to`, `date_on_sale_to_gmt`

**Root cause:** The WC OPTIONS response has two sources of schema: `schema.properties` (used for GET response shape) and `endpoints[POST].args` (used for POST request shape). These can contradict each other. For these date fields, `endpoints[POST].args` explicitly declares `type: ["null", "string"]` — null is a valid value meaning "no expiry/date set". The snapshot's `response.fields` is derived from `schema.properties` which omits the null.

**Diagnosis:** Check `endpoints[POST].args[<field>].type` in the raw OPTIONS response (or via Postman against `http://localhost:8080/wp-json/wc/v3/coupons` with OPTIONS method).

**Fix:** Add to `knownNullable` in the response schema registration.

#### Category 2 — Integer field with no default; null means "unset"

**Affected fields:** `usage_limit`, `usage_limit_per_user`, `limit_usage_to_x_items`, `stock_quantity`

**Root cause:** WC uses `null` to mean "unlimited" or "not tracked" — semantically distinct from `0`. The JSON Schema omits null because the schema author documented the non-null type, but the API returns null when the limit has not been set. Nothing in the OPTIONS schema predicts this.

> **Key insight:** `required: false` + `integer` type does NOT imply nullable. Strings default to `""`, arrays to `[]`, integers to `null`. This behavior is empirically consistent but not schema-documented.

**Diagnosis:** Fetch a live resource via GET and check if the field is `null` when not configured.

**Fix:** Add to `knownNullable`.

#### Category 3 — Readonly computed fields; null before the event occurs

**Affected fields:** `date_modified`, `date_modified_gmt`, `date_paid`, `date_paid_gmt`, `date_completed`, `date_completed_gmt`

**Root cause:** These timestamps are set by WC when a specific event occurs (first modification, payment received, order completion). Before that event, the field is `null`. They are not present in POST args (they're readonly), so the schema only documents the non-null type for when the value exists.

**Diagnosis:** Fetch a newly-created resource (e.g., an unpaid order) and check the timestamp field.

**Fix:** Add to `knownNullable`.

#### Category 4 — Object field null when resource has no associated resource

**Affected fields:** `image` (product categories, product brands, store product categories), `product_image` (product reviews)

**Root cause:** WC returns `null` when a category/brand has no image assigned, even though the schema documents `image` as an object. The absence-of-image state is represented as `null` rather than an empty object.

**Diagnosis:** Fetch a resource that has no image assigned (create a category without an image).

**Fix:** Add to `knownNullable`.

### Applying the Fix

In all four categories, the resolution is the same — add the field to `knownNullable` in the relevant domain barrel:

```typescript
// packages/core/src/lib/types/admin/coupons/index.ts
schemaRegistry.add(AdminCouponSchema, {
  surface: 'admin',
  route: '/wc/v3/coupons',
  kind: 'response',
  // WC JSON Schema declares these as non-nullable, but the live API returns
  // null when they are unset (e.g. no expiry, unlimited usage).
  knownNullable: [
    'date_expires',
    'date_expires_gmt',
    'limit_usage_to_x_items',
    'usage_limit',
    'usage_limit_per_user',
  ],
});
```

The `reconcile.mjs` reconciler downgrades `nullable-mismatch` for these fields from `warn` to `info`, keeping the drift gate clean while preserving the information.

---

## Adding New Schemas

### File Split Convention

Each domain follows a consistent file structure under `packages/core/src/lib/types/admin/{domain}/` (or `store/{domain}/`):

| File                        | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| `{domain}.schema.ts`        | Main Zod response schema (GET response shape)         |
| `{domain}.create.schema.ts` | POST request schema                                   |
| `{domain}.update.schema.ts` | PUT/PATCH request schema                              |
| `{domain}.query.schema.ts`  | Query parameter schema                                |
| `{domain}.batch.schema.ts`  | Batch endpoint schemas (optional)                     |
| `index.ts`                  | `schemaRegistry.add()` calls + `export * from` barrel |

All schema files export named Zod schemas (e.g., `AdminTaxRateSchema`, `AdminTaxRateCreateRequestSchema`). The `index.ts` file wires them to the registry and re-exports everything.

### Registration Pattern

In `index.ts`, register each schema with its full route and kind:

```typescript
// packages/core/src/lib/types/admin/tax-rates/index.ts
import { schemaRegistry } from '../../schema-registry.js';
import { AdminTaxRateSchema } from './tax-rate.schema.js';
import { AdminTaxRateCreateRequestSchema } from './tax-rate.create.schema.js';
import { AdminTaxRateUpdateRequestSchema } from './tax-rate.update.schema.js';
import { AdminTaxRateQueryParamsSchema } from './tax-rate.query.schema.js';

schemaRegistry.add(AdminTaxRateSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes',
  kind: 'response',
});
schemaRegistry.add(AdminTaxRateCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminTaxRateUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminTaxRateQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/taxes',
  kind: 'query',
  method: 'GET',
});

export * from './tax-rate.schema.js';
export * from './tax-rate.create.schema.js';
export * from './tax-rate.update.schema.js';
export * from './tax-rate.query.schema.js';
```

**Rules:**

- One `schemaRegistry.add()` call per route + kind + method combination.
- The `route` string must match the exact route pattern from WC's OPTIONS discovery (e.g., `/wc/v3/taxes/(?P<id>[\\d]+)` for single-item routes).
- Every registered schema must be exported from `index.ts` — `schema-map.ts` uses barrel export names to identify schemas. An unexported schema is silently skipped with a console warning.
- The domain `index.ts` must be re-exported from the surface barrel: `packages/core/src/lib/types/admin/index.ts`.

### Batch Endpoint Note

WC batch endpoints (`/wc/v3/{resource}/batch`) expose the single-item update schema in OPTIONS, not the batch envelope. If you add a batch response schema (e.g., `{ create: [...], update: [...], delete: [...] }`), do **not** register it via `schemaRegistry.add()` — it has no matching upstream OPTIONS schema to diff against and will produce false-positive `missing-in-sdk` errors.

### After Adding a New Schema

1. Run `pnpm run types:sync:local`.
2. New `missing-in-sdk` entries indicate fields WC exposes that your Zod schema omits — add them.
3. New `extra-in-sdk` entries indicate fields your Zod schema has that WC does not — remove them.
4. Check `list-routes` output decreases (the route should no longer appear as unmapped).

---

## Ack Mechanisms

The reconciler in `reconcile.mjs` applies two types of acknowledgements that downgrade drift severity from `warn` → `info`, keeping the CI gate clean while preserving the information.

### `knownNullable` — Acknowledge nullable mismatches

**When to use:** The live WC API returns `null` for a field, but the WC OPTIONS schema declares `nullable: false`. The SDK correctly accepts null; the WC schema is wrong.

**When NOT to use:**

- Do not use `knownNullable` as a substitute for adding `.nullable()` to the Zod schema when the SDK itself should expose the field as nullable to callers. If callers need to handle `null`, the Zod schema needs `.nullable()` too.
- Do not use without first verifying via a live GET response that the field actually returns `null`.

**Syntax:**

```typescript
schemaRegistry.add(AdminCouponSchema, {
  surface: 'admin',
  route: '/wc/v3/coupons',
  kind: 'response',
  // WC JSON Schema declares these as non-nullable, but the live API returns
  // null when they are unset (e.g. no expiry, unlimited usage).
  knownNullable: [
    'date_expires',
    'date_expires_gmt',
    'limit_usage_to_x_items',
    'usage_limit',
    'usage_limit_per_user',
  ],
});
```

**Effect in drift output:** `nullable-mismatch` severity drops from `warn` to `info` for each listed field. The drift record is still present (it's informational, not silenced), so it remains auditable.

**Comment requirement:** Always add a comment explaining why these fields are nullable. Future contributors need to understand the category (see [Nullable Mismatch Deep Dive](#nullable-mismatch-deep-dive)).

### `deprecated` — Acknowledge removed fields

**When to use:** A field exists in the SDK Zod schema but has been removed from a newer WC version. The field must be kept for older clients still within the support window.

**Syntax:**

```typescript
schemaRegistry.add(AdminOrderSchema, {
  surface: 'admin',
  route: '/wc/v3/orders',
  kind: 'response',
  deprecated: {
    fields: ['customer_ip_address', 'customer_user_agent'],
    sinceVersion: '9.0.0',
    note: 'Removed in WC 9.0 for privacy reasons. Kept for clients on 8.x.',
  },
});
```

**Effect in drift output:** `extra-in-sdk` severity drops from `error` to `info` for each listed field with `acked: true` in provenance.

**Note:** `reconcile.mjs` also automatically downgrades `extra-in-sdk` to `info` (with `driftKind: 'removed-in-window'`) when the field is still present in any older version in the support window — even without an explicit `deprecated` entry. Use `deprecated` for explicit intentional acks with human-readable notes.

### Combined Example

```typescript
schemaRegistry.add(AdminProductSchema, {
  surface: 'admin',
  route: '/wc/v3/products',
  kind: 'response',
  knownNullable: [
    'date_on_sale_from',
    'date_on_sale_from_gmt',
    'date_on_sale_to',
    'date_on_sale_to_gmt',
    'stock_quantity',
  ],
  deprecated: {
    fields: ['enable_html_description'],
    sinceVersion: '9.5.0',
    note: 'Removed in WC 9.5. Kept for back-compat with older window versions.',
  },
});
```

---

## WC Schema Reliability

The WooCommerce OPTIONS schema is useful but incomplete. Do not treat it as the authoritative spec for runtime behavior.

### Known Schema Gaps

**1. `schema.properties` and `endpoints[POST].args` can contradict each other.**

Within a single OPTIONS response, the `schema.properties` object (which `capture-upstream.mjs` uses to build `response.fields`) and `endpoints[POST].args` (which builds `request.POST.fields`) can declare different types for the same field. Most notably, POST args sometimes declare `type: ["null", "string"]` for date fields that `schema.properties` declares as plain `string`. The snapshot is built from `schema.properties` only, so the response-side nullable status for these fields is wrong.

**2. `required: false` does not predict null for integers.**

WC uses `null` to represent "unset" for integer fields like `usage_limit`, `stock_quantity`, and similar. A field declared as `type: integer, required: false` with no default will return `null` (not `0`) from a live GET when the value has never been set. This is empirically consistent across WC versions but is not documented in the schema. Strings default to `""`, arrays to `[]`, integers to `null`.

**3. Readonly computed fields are not present in POST args, and are null before their triggering event.**

Timestamp fields like `date_paid`, `date_completed`, `date_modified` are computed server-side. They do not appear in POST args (readonly), and they are `null` on resources where the event has not yet occurred (e.g., `date_paid` is `null` on an unpaid order). The schema documents only the non-null state.

### Ground Truth: Live GET Response

When in doubt about whether a field is nullable or what its type actually is:

1. Fetch a live resource via GET (using Postman or `curl` against the local Docker WC instance).
2. Check the actual field value, especially in edge cases: resource just created, field not yet set, optional association absent.
3. Trust the live response over the OPTIONS schema.

```bash
# Quick live check for coupons with no expiry
node -e "
const h = { Authorization: 'Basic ' + Buffer.from('admin:<password>').toString('base64') };
fetch('http://localhost:8080/wp-json/wc/v3/coupons?per_page=1', { headers: h })
  .then(r => r.json())
  .then(([c]) => console.log('date_expires:', c.date_expires))
"
```

### WC Version Pinning

`scripts/types-sync/support-window.json` controls which WC versions are captured and diffed:

```json
{ "versions": ["10.7.0"], "latest": "10.7.0" }
```

Changing this file to add/remove versions affects:

- Which snapshots are loaded during `check`
- What constitutes a `removed-in-window` ack vs a genuine `extra-in-sdk` error
- When deprecated fields become safe to remove

Do not update `support-window.json` without verifying that a snapshot for the new version exists in `snapshots/`.

---

## Boundaries

### Always

- Re-run `pnpm run types:sync:local` after any schema change and verify both `error` and `warn` counts.
- Add a code comment explaining the nullable category whenever adding a field to `knownNullable`.
- Verify via a live GET response before adding any field to `knownNullable`.
- Export every registered schema from its domain `index.ts` — unexported schemas are silently skipped.

### Ask First

- Adding `knownNullable` for a field that hasn't been verified via live GET against a real WC instance.
- Bumping `support-window.json` to a new WC version — requires a valid snapshot to exist first.
- Removing a field from the SDK that still appears in `removed-in-window` info entries — confirm the version is no longer in the window.

### Never

- Suppress `error`-severity drift without actually fixing the schema mismatch.
- Use `knownNullable` as a substitute for a Zod `.nullable()` fix when the SDK public API should expose the field as nullable to callers. `knownNullable` is an ack to the drift system only — it does not make the Zod schema accept null at runtime.
- Register a batch request schema (`{domain}.batch.schema.ts`) via `schemaRegistry.add()` — it has no matching upstream OPTIONS schema and causes false-positive errors.
- Edit `scripts/types-sync/schema-map.ts` to add schemas directly — all registration goes through `schemaRegistry.add()` in domain barrels.

---

## Related Skills

- **`test-driven-development`** — for writing tests against new schema definitions.
- **`debugging-and-error-recovery`** — if `normalise.mjs` produces unexpected type output or the diff engine emits confusing results.
- **`incremental-implementation`** — for adding new domain coverage across multiple schema files without breaking the drift gate mid-implementation.

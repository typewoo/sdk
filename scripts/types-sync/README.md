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
5. Writes `out/drift.json` and `out/drift.md`. Exits non-zero on any `error`
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

## Files

| File | Role |
|---|---|
| `cli.mjs` | Entry point. Subcommands: `capture`, `check`, `list-routes`. |
| `capture-upstream.mjs` | Fetches per-surface discovery JSON from a running WP+WC instance. |
| `introspect-zod.mjs` | `z.toJSONSchema` → normalised shape. |
| `normalise.mjs` | Shared normaliser used by both sides + `sortKeysDeep`. |
| `diff.mjs` | Pure diff engine + severity matrix. |
| `report.mjs` | JSON + Markdown writers. |
| `schema-map.ts` | The registry — only manual seam. |
| `snapshots/wc-*.json` | Committed upstream snapshots, one per WC version. |
| `out/drift.{json,md}` | Generated report (gitignored). |

## Why not codegen?

Our Zod schemas carry hand-written JSDoc, conventions, and runtime
`looseObject` semantics that aren't easily round-tripped from JSON Schema.
This tool **compares and notifies**; updates remain a deliberate human edit.

## Typewoo Monorepo – Coding Agent Onboarding

Purpose: Fast, low-error contributions to a TypeScript / Nx monorepo that provides a headless WooCommerce SDK (Store API + Admin REST API) plus a WordPress auth plugin and Angular example app.

Keep output concise, deterministic, and conformant with repo conventions. Follow these instructions before making ANY change.

---

### 1. What This Repo Does

TypeScript-first SDK for WooCommerce APIs:

- **Store API** (`sdk.store.*`): Products, cart, checkout, orders – for customer-facing storefronts
- **Admin REST API** (`sdk.admin.*`): Full CRUD for products, orders, customers, coupons, taxes, etc. – for admin dashboards
- Event-driven core (`EventBus`) with automatic nonce, cart token, JWT & refresh token interceptors (Axios)
- WordPress plugin (`plugins/typewoo/`) providing JWT authentication endpoints

Primary deliverable: `@typewoo/sdk` npm package. Everything else supports development & testing.

---

### 2. Tech Stack (Authoritative)

- Node 20+, **pnpm** workspaces, Nx 22.x, Pure ESM (`"type": "module"`)
- TypeScript 5.9, Vitest (unit/integration/flow tests), Axios, qs, zod
- Angular 20 (example only – do NOT introduce Angular deps into libraries)
- Tailwind/PostCSS for example app styling
- Docker Compose WordPress env for auth integration tests (optional for most changes)

---

### 3. Project Structure (High Signal)

```
packages/
  core/           # Main SDK: services, interceptors, event bus
examples/
  angular/        # Demo storefront app
plugins/
  typewoo/        # WordPress JWT auth plugin (PHP)
infra/wordpress/  # Docker compose + WP setup scripts
scripts/          # Build/test utilities
docs/             # MDX documentation (Mintlify) → published to typewoo.dev
```

**Documentation (`docs/`)**: MDX files for [typewoo.dev](https://typewoo.dev). Structure defined in `docs.json`. Key files:

- `getting-started.mdx`, `configuration.mdx` – Quick start guides
- `authentication.mdx`, `hooks-and-events.mdx` – Core concepts
- `api-reference/*.mdx` – Service-level API docs (products, cart, orders, customers)

When adding new SDK features, update relevant docs if the feature is user-facing.

Core internals (`packages/core/src/lib/`):

- `sdk.ts` – Init logic, interceptor wiring, service instantiation
- `services/store/*.service.ts` – Store API services (products, cart, checkout, orders)
- `services/admin/*.service.ts` – Admin REST API services (21+ services for full WC admin)
- `services/store.service.ts` – Aggregates all Store services as `sdk.store.*`
- `services/admin.service.ts` – Aggregates all Admin services as `sdk.admin.*`
- `http/http.ts` – HTTP helpers (`doGet`, `doPost`, `doPut`, `doDelete`) using shared Axios client
- `interceptors/*.interceptor.ts` – Nonce, cart token, access token, refresh token, admin auth
- `bus/event.bus.ts` – Typed EventBus with `on`/`once`/`onAny`/middleware support
- `configs/sdk.config.ts` – SDK configuration types and resolution
- `storage/` – Pluggable storage providers (memory, localStorage, sessionStorage)
- `types/` – Shared TypeScript interfaces/DTOs
- `tests/` – Organized as unit/integration/flow

**Public API surface**: Only `src/index.ts` exports are public. Never deep-import internal files from outside their package.

---

### 4. Golden Path Workflow (Always Follow)

1. `pnpm install` (MANDATORY—fail fast if node_modules missing)
2. Format check: `pnpm run format:check` (fix with `pnpm run format`)
3. Implement change (see section 5 for patterns)
4. Build: `pnpm nx build core` (or `pnpm nx run-many -t build` for multi-package)
5. Test: `pnpm nx test core` (add `--coverage` if changing runtime logic)
6. Lint: `pnpm nx lint core`
7. Verify `index.ts` exports only intended public symbols
8. Add tests for new code paths (coverage target ≥ 98%)
9. Re-run full suite before final output

CI enforces: install → lint → format check → test → build. Local parity reduces iteration churn.

---

### 5. Implementation Patterns

Adding a new Store service:

1. Create file: `packages/core/src/lib/services/store/<domain>.service.ts`
2. Constructor signature: `(state: SdkState, config: SdkConfig, events: EventBus<SdkEvent>)`
3. Use shared Axios helpers (do NOT create new axios instances) – import from `services/api.js`
4. Emit events with consistent naming: `'<entity>:<action>'` (e.g. `cart:updated`) only when state materially changes.
5. Add private field + getter in `store.service.ts` (alphabetical order by property name group when practical)
6. Export types/functions via `packages/core/src/index.ts` only.
7. Write unit tests under `tests/unit/...` or integration under `tests/integration/...` mirroring existing structure; name `*.spec.ts`.

Interceptors:

- Keep idempotent; guard against duplicate installation.
- Respect `config.auth?.useTokenInterceptor` & `useRefreshTokenInterceptor` flags.

Events:

- Use EventBus; avoid global side effects.
- If adding new event names, ensure tests assert emission (happy & error paths when meaningful).

Error Handling:

- Return typed result objects (data / error) consistent with existing patterns.
- No silent catches—log (if future logging infra added) or bubble up.

---

### 6. Coding & Style Guidelines

- Pure ESM: always use explicit `.js` extension in relative imports inside source TypeScript (already configured via TS emit). Do NOT introduce CommonJS.
- Maintain alphabetical or logical grouping in export barrels; avoid reshuffling unrelated lines.
- Avoid speculative abstractions—mirror WooCommerce endpoints directly.
- Strong, explicit assertions in tests (no truthy/falsy shortcuts).
- Prefer small, focused commits; no drive-by reformatting.
- Do not edit root `package.json`, Nx configs, or CHANGELOGs unless the task explicitly requires it.

---

### 7. Available Scripts (High-Value)

- Build all: `pnpm nx run-many -t build`
- Test all: `pnpm nx run-many -t test`
- Lint all: `pnpm nx run-many -t lint`
- Clean rebuild: `pnpm run dev:rebuild`
- **Docs dev server**: `pnpm run docs:start:dev` (runs Mintlify locally for docs preview)
- WordPress env up: `pnpm run wp:env:up` (optional, slower; only for plugin integration flows)
- Angular example serve: `pnpm run serve:example:angular`

Use Nx targets over ad‑hoc TypeScript/Vitest commands to leverage caching and consistent options.

---

### 8. Testing Strategy (Essentials)

- Unit: Fast logic & service method behavior.
- Integration: Interplay of services, interceptors, and events (no real HTTP calls—mock axios if needed).
- Flow: Higher-level multi-step flows.
- Always add tests for new branches (success + at least one failure path).
- Regenerate test index after adding specs: `pnpm run docs:tests` (optional but keeps docs fresh).

Coverage discipline: If runtime code changes and coverage dips below threshold, add tests immediately—do not mark lines ignored unless they are pure types or defensive impossible branches (comment why if skipped).

---

### 9. Performance & Reliability Guardrails

- Avoid introducing new network calls outside existing HTTP client.
- Debounce or batch only if a performance problem is proven—otherwise keep implementation direct.
- Prevent duplicate interceptor registration (track with module-level boolean if adding new one).

---

### 10. Common Pitfalls (Avoid)

- Forgetting `pnpm install`: leads to missing peer dep errors.
- Omitting `.js` extension in new relative imports.
- Exporting internal helpers unintentionally (inflates public API surface).
- Adding service without wiring getter in `store.service.ts` (undefined at runtime).
- Writing broad test assertions (`expect(res).toBeTruthy()`).
- Skipping Prettier check (CI failure). Run `pnpm run format` if needed.

---

### 11. Minimal Sample Feature (Template)

Example: New service `product.inventory.service.ts` to expose `/products/<id>/inventory`.
Steps (do this adaptively for real tasks):

1. Add service file under `services/store/` implementing required methods.
2. Add private field + getter in `store.service.ts` (`inventory`).
3. Export via `src/index.ts` if public.
4. Add tests under `tests/unit/store/product.inventory.service.spec.ts` covering: successful fetch, not-found (error branch), event emission if state tracked.
5. Run build, test, lint, format.

---

### 12. When Unsure

If documentation missing for Nx behavior or generators: query Nx docs (internal tool) instead of guessing. Prefer reading existing similar service or plugin for exact pattern replication.

---

### 13. Output Expectations for Agent

Before finishing a task:

- Report Build PASS/FAIL, Lint PASS/FAIL, Test PASS/FAIL, Format PASS/FAIL.
- List touched files + rationale.
- Map each explicit user requirement to Done/Deferred (with reason).

If blocked by missing data (e.g., endpoint spec), request minimal clarifying info instead of stalling.

---

### ❌ Never Do

- Modify `package.json`, `nx.json`, `CHANGELOG*`, `renovate.json` without explicit request
- Introduce CommonJS wrappers (pure ESM repo)
- Add unnecessary dependencies (prefer axios, qs, date-fns, stdlib)
- Skip format checks - they will fail CI
- Make cross-plugin dependencies or branching logic

**Trust these instructions** - all commands have been validated to work correctly. Only search for additional information if these instructions are incomplete or found to be incorrect.

## 4.0.1 (2026-09-22)

### 🩹 Fixes

- **core:** type gateway and shipping method settings as maps ([7fe1030](https://github.com/typewoo/sdk/commit/7fe1030))

# 4.0.0 (2026-09-22)

> **⚠️ 4.0.0 is a major release with breaking changes.** Read the upgrade
> summary and work through the migration checklist at the end before
> upgrading from 3.x. If you tried 4.0.0-alpha.0, the type changes below
> also apply to you.
>
> **WooCommerce compatibility:** the request and response types are checked
> against WooCommerce 10.7.0 and 11.1.1. Fields added in 11.1 are optional and
> marked `WooCommerce 11.1+` in their descriptions.

### 📝 Upgrade summary (read this first)

#### ⚠️ Breaking change — `Typewoo.init()` singleton removed, use the `createTypewoo` factory

The global `Typewoo` singleton, its `Typewoo.init(config)` initializer and the
`Sdk` class have been **removed**. Build your own instance with the
`createTypewoo(config)` factory, which returns a `TypewooClient`.

`createTypewoo()` already existed in 3.x as the recommended approach — in 4.0 it
is now the **only** way.

```typescript
// Before (3.x) — global singleton, initialized in place
import { Typewoo } from '@typewoo/sdk';

await Typewoo.init({
  baseUrl: 'https://your-store.example',
  request: { retry: { enabled: true } },
});

const products = await Typewoo.store.products.list();

// After (4.0) — create your own instance and export it
import { createTypewoo } from '@typewoo/sdk';

export const typewoo = createTypewoo({
  baseUrl: 'https://your-store.example',
  request: { retry: { enabled: true } },
});

const products = await typewoo.store.products.list();
```

Import that instance wherever you need it. The service API on the instance
(`store`, `auth`, `admin`, `analytics`, `endpoints`, `events`, `state`) is
unchanged.

**Startup timing:** `Typewoo.init()` was async and finished reading the stored
access token before resolving. `createTypewoo()` returns synchronously, so
`state.authenticated` is not set yet and the first `auth:changed` event fires
shortly after. If you read auth state at startup, `await typewoo.ready` first.

#### ✨ Every instance is now fully independent

Each `createTypewoo()` call gets its own Axios client, interceptors, config,
request hooks and token-refresh queue. Previously all instances shared one
global client, so a second instance used the first one's `baseUrl`, and
creating an instance per server request piled up interceptors and could send
one user's token on another user's request. You can now safely:

- talk to several stores from one app, and
- create one instance per request in SSR (with request-scoped storage).

#### ⚠️ Breaking change — global HTTP/config helpers removed

- **Removed:** `createHttpClient()`, `getSdkConfig()` and `setSdkConfig()`. The
  SDK creates its client per instance; read config from `typewoo.config`.
- **Deprecated:** `httpClient`. It now points at the _first_ instance's client.
  Use `typewoo.http.client` to add your own interceptors.
- **New:** `typewoo.http` — `get`, `post`, `put`, `delete`, `head` bound to the
  instance, plus `client` (its Axios instance).

#### ✨ Custom endpoints: factory form

`endpoints` can now be a factory that receives the instance's `http` helpers.
Use it whenever your app creates more than one instance. The free helpers
(`doGet`, `doPost`, …) always target the first instance created.

```typescript
const typewoo = createTypewoo({
  baseUrl: 'https://your-store.example',
  endpoints: (http) => ({
    posts: () => http.get<Post[]>('/wp-json/wp/v2/posts'),
  }),
});
```

A plain object of endpoints still works unchanged for single-instance apps.

#### ⚠️ Breaking change — types rebuilt from WooCommerce's REST schemas

The request and response types were rebuilt from WooCommerce's published
REST schemas and checked against a live store, route by route. Many 3.x
types didn't match what WooCommerce actually sends or accepts; those are
fixed here, and some of the fixes change a type's shape.

**Admin request types were split into create and update variants.** The
3.x `Admin*Request` names still work as deprecated aliases of the update
variant (all fields optional, like before) and will be removed in 5.0:

| 3.x name                                                                                                                                                                                       | Use instead                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `Admin{Brand,Coupon,Customer,Order,ProductAttribute,ProductAttributeTerm,Product,ProductReview,ShippingClass,ShippingZone,ShippingZoneMethod,Tax,TaxonomyCategory,TaxonomyTag,Webhook}Request` | `…CreateRequest` for `create()`, `…UpdateRequest` for `update()` |
| `AdminPaymentGatewayRequest`, `AdminSettingRequest`                                                                                                                                            | `…UpdateRequest`                                                 |
| `AdminOrderNoteRequest`, `AdminTaxClassRequest`                                                                                                                                                | `…CreateRequest`                                                 |

The same applies to each `…RequestSchema`. Note that some create variants
now require fields WooCommerce requires (e.g. coupon `code`, webhook
`topic` and `delivery_url`).

**Removed exports without an alias:**

- Shared admin schemas from `common.types`: `AdminAddress`, `AdminLinks`,
  `AdminImage`, `AdminDimensions`, `AdminTaxLine` (and their `…Type`
  aliases), and `AdminCouponDiscountType`. Use the field types of the
  resource you're working with, e.g. `AdminOrder['billing']`.
- `AdminMetaData` is now the meta entry **type**; the schema is
  `AdminMetaDataSchema`, and `AdminMetaDataType` is a deprecated alias.
  Meta values may now be arrays. Create/update requests use
  `AdminMetaDataInput`, where `id` is optional (omit it to add a new entry).
- Shared analytics schemas: `AnalyticsIntervalEnum`/`AnalyticsIntervalType`,
  `AnalyticsLink(s)`, `AnalyticsListQueryParams`, `AnalyticsStatsQueryParams`,
  `AnalyticsSegmentSchema`. Each report now has its own query and response
  types, e.g. `AnalyticsRevenueQueryParams`.

**Fields that changed shape:**

- Response fields WooCommerce doesn't guarantee are now optional, e.g.
  `ProductResponse` `name`, `slug`, `sku`, `description`, `images`,
  `categories`, `tags`, `attributes`, `variations`, and most admin entity
  fields. Code that assigned them to non-optional variables needs a fallback.
- `CartCouponResponse.type` is now `discount_type`, and `code` is optional.
- `CheckoutResponse.__experimentalCart` was removed.
- `ProductAttributeTermRequest.id` was removed (the ID is part of the URL).
- `CartItemAddRequest`, `CartItemEditRequest`, `CartExtensionsRequest` and
  all checkout address fields are now optional.
- Review `reviewer_avatar_urls` is an object keyed by size, not an array.
- `ProductRequest.rating` is an array of integers 1–5 (`rating: [4, 5]`),
  matching the Store API; it was a single `number` in 3.x and an array of
  strings (`'1'`–`'5'`) in 4.0.0-alpha.0.
- `ProductRequest.attributes` is an array of
  `{ attribute, term_id | slug, operator? }` objects, matching the Store API.
- `ProductRequest._unstable_tax_` / `_unstable_tax_operator` arrays were
  replaced by WooCommerce's own flat keys, e.g.
  `{ _unstable_tax_product_type: 'simple,variable', _unstable_tax_product_type_operator: 'in' }`.
  Pass several terms comma-separated (WooCommerce rejects arrays here). For
  categories, tags and brands use `category`, `tag` and `brand`:
  WooCommerce ignores `_unstable_tax_product_cat` and friends. The old
  arrays were serialised incorrectly and never filtered anything.
- `AdminOrderRefund` (the entries of `AdminOrder.refunds`) is
  `{ id, reason, total }`, which is all WooCommerce returns there; fetch
  the full refund with `admin.refunds` if you need more.
- `AdminOrderLineItem.price` is a `number` (it was typed as a string), and
  `image.id` is `number | string` (`""` when the product has no image).
  `sku`, `parent_name` and the new `global_unique_id` can be `null`, and
  `image.src` can be `false` (deleted product or image). Refund line items
  share the order line item type.
- Order item `meta_data` entries (on every line type) carry
  `display_key` / `display_value`; `display_value` can be any meta value.
- `AdminProduct.shipping_class_id` and `AdminProductVariation.shipping_class_id`
  are `number`.
- `orders.sendEmail()` / `sendOrderDetails()` return
  `AdminOrderActionResult` (`{ message }`).
- `AdminOrderCouponLine` gained `discount_type`, `nominal_amount` and
  `free_shipping`.
- Analytics `getStats()` methods return per-report types (e.g.
  `AnalyticsRevenueStatsResponse`) instead of `AnalyticsStatsResponse<T>` /
  `AnalyticsTotalsResponse<T>`, which are deprecated along with
  `AnalyticsSegment`, `AnalyticsSegmentedTotals` and
  `AnalyticsStatsInterval` (removal in 5.0).
- The analytics stats reports type their `segments` (they were `{}[]`):
  `segment_id` is `number | string` (coupon segments use strings) and
  `segment_label` can be `null` (e.g. `segmentby=customer_type`). Order and
  revenue interval subtotals no longer have `products`, which WooCommerce
  only returns in `totals`; products and variations stats gained
  `products_count` / `variations_count`.
- Store API responses: `CheckoutResponse.billing_address` and its fields
  are always present; order `errors` entries are `{ code, message }` (no
  `data`); order `tax_lines`, `payment_details`, collection-data
  `stock_status_counts` and attribute terms' `default` are typed; order
  coupons have `discount_type`. `AdminTaxClass.name` is required.
- **Product variations:** `AdminProductVariation` fields WooCommerce
  doesn't guarantee are optional, `image` can be `null`, and it gained
  `type`, `parent_id`, `name` and `global_unique_id`. The variation methods
  take their own types (`AdminProductVariationCreateRequest`,
  `…UpdateRequest`, `…QueryParams`, `…GenerateRequest`) instead of
  product or `Partial<AdminProductVariation>` types, and
  `generateVariations()` returns `{ count, deleted_count? }`.
- **`products.duplicate()`** returns `AdminProductDuplicateResponse`:
  WooCommerce returns the raw product data there (e.g. `category_ids`,
  dates as objects), not the REST product shape.
- **Reports:** `AdminTopSellersReport.title` is `name`;
  `AdminSalesReport.total_refunds` and `AdminTotalsReportEntry.total` are
  numbers. `AdminReportsQueryParams` only has `context`, and the sales and
  top-sellers params lost `interval`, `per_page` and `page`, which
  WooCommerce ignores. `AdminCustomersReport(QueryParams)` and
  `AdminOrdersReport(QueryParams)` are aliases of the totals types.
- **`AdminSystemStatus`** matches the live API:
  `enforce_approved_download_dirs` (was
  `enforce_approved_product_download_directories`),
  `woocommerce_com_connected` and `pages[].page_id` are strings,
  `database_tables` is `{ woocommerce, other }`, `theme.overrides` is an
  array of `{ file, version, core_version }`, and `_links` is gone.
- **Order actions:** `AdminOrderReceipt` is
  `{ receipt_url, expiration_date }`; `AdminOrderEmailTemplate` is
  `{ id, title, description }`; `AdminOrderStatusInfo` has no `total`;
  `AdminOrderSendEmailRequest.template_id` is an optional string, and
  `AdminOrderEmailTemplateId` drops `new_receipt`.
- `AdminShippingZoneLocation` fields and the `AdminContinent` locale
  fields are optional, and continent state codes can be numbers.

**Removed: `analytics.categories.getStats()`.** It called
`/wc-analytics/reports/categories/stats`, a route WooCommerce doesn't have,
so it always returned a `rest_no_route` error. Use
`analytics.products.getStats({ segmentby: 'category' })` instead. The
`AnalyticsCategoriesStatsQueryParams` and `AnalyticsCategoryStats` types
were removed with it.

#### 🩹 Fixes and additions

- **Checkout accepts any payment gateway.** `payment_method` was limited to
  `bacs`, `cheque` and `cod`; it's now a string, so `'stripe'` and other
  gateways type-check and validate. `payment_data` (gateway key/value
  pairs, values may be strings or booleans) is back on
  `CheckoutCreateRequest`, along with `customer_password` for new accounts.
- **`CheckoutUpdateRequest`** (`store.checkout.update()`) now has the
  fields WooCommerce accepts when updating the draft order, including
  `order_notes` (which only applies there), and `additional_fields` is an
  object (it was an array).
- **`OrderRequest`** (`store.checkoutOrder.order()`, paying for an existing
  order) only requires `key` and `billing_address`, matching WooCommerce;
  `shipping_address` and `payment_method` are optional, and
  `customer_note`, `additional_fields` and `extensions` were added.
- **`ProductCollectionDataRequest`** accepts every products filter
  (category, price, attributes, …), so collection data can describe a
  filtered collection.
- **`AdminPaymentGatewayUpdateRequest`** gained `title` and `description`.
- **`AdminCouponQueryParams`** no longer requires `dates_are_gmt` and
  `exclude` (defaulted fields were typed as required).
- **Admin `meta_data`** accepts array values on every resource, and create
  or update requests can add entries without an `id`.
- **`AdminProductReviewQueryParams.reviewer`** takes user IDs (`number[]`).
- **`ProductAttributeTermService.list()`** returns
  `ProductAttributeTermResponse[]` (it was typed as attributes).
- **Removing order lines:** `AdminOrderCreateRequest` / `UpdateRequest`
  accept `null` for a line's `product_id`, `name`, `method_id`,
  `method_title` or `code`, which is how WooCommerce removes it
  (`{ id, product_id: null }`).
- **Partial refunds:** `AdminRefundCreateRequest` gained `line_items`
  (`{ id, quantity?, refund_total?, refund_tax? }`) to refund individual
  line, shipping or fee items.
- **Store batch:** `requests[].method` is optional (defaults to `POST`).
- **Product filters:** `ProductRequest.attributes[].term_id` / `slug`
  accept arrays.
- **New types:** `AdminBatchResponse`, `AdminOrderActionResult`,
  `OrderQueryParams` (Store API `GET /order/{id}`), and `AdminRefund`
  gained `parent_id`.
- **Query strings are encoded.** Services sent query values unencoded, so
  `search: 'a&b'` searched for `a`, a `#` cut off the rest of the URL, `+`
  became a space, and a value could add its own parameters. Values are now
  URL-encoded (brackets in keys stay readable).
- Request and query types use `z.input`, so fields with defaults stay
  optional for callers.
- **`AdminOrderSendEmailRequest`** checks its fields again (a type bug let
  any object through); core template IDs still autocomplete.
- **`AdminPaymentGatewayUpdateRequest.settings`** accepts string arrays for
  multiselect settings (e.g. COD `enable_for_methods`).
- **Admin products:** create/update `attributes[]` entries only need the
  fields you're setting (`AdminProductAttributeInput`); `visible` and
  `variation` default to `false`.
- The docs' custom-endpoint examples passed `params`/`headers` at the top
  level of `RequestOptions`, where they're ignored; they belong in
  `axiosConfig`.

#### ✨ WooCommerce 11.1 support

- Product variations: `gallery_image_ids` (responses and
  create/update/generate requests); products and variations accept an
  `image_size` query param.
- Refunds: `compute_totals` on `AdminRefundCreateRequest` lets WooCommerce
  compute each line's amount from its quantity; order `refunds[]` entries
  include `total_tax`.
- Categories: `menu_order` on create/update requests.
- Store API: `expected_total` on `CheckoutCreateRequest` (the order is
  rejected if the server total differs), and attribute terms can return
  `__experimentalVisual` swatch data when requested with
  `__experimental_visual`.
- WooCommerce 11.1 rejects products `orderby` values `post__in`, `random`
  and `sales`; they remain in the type for 10.x stores.

#### 🗓️ Deprecated (removed in 5.0)

- `httpClient`: use `typewoo.http.client`.
- The 3.x `Admin*Request` / `Admin*RequestSchema` names: use the
  `…CreateRequest` / `…UpdateRequest` variants.
- `AdminMetaDataType`: use `AdminMetaData`.
- `AnalyticsStatsResponse`, `AnalyticsTotalsResponse`, `AnalyticsSegment`,
  `AnalyticsSegmentedTotals`, `AnalyticsStatsInterval`: use each report's
  own types, e.g. `AnalyticsRevenueStatsResponse`.

#### 🔧 Keeping types in sync with WooCommerce

The repository now checks every WooCommerce route the SDK calls against
WooCommerce's published schema (232 checks), including fields inside
arrays. CI fails on a new difference or on a new WooCommerce route that
isn't mapped or explicitly skipped, and new WooCommerce releases are picked
up automatically as a pull request with a fresh schema snapshot.

#### ✅ Migration checklist

- [ ] Replace `await Typewoo.init({...})` with `export const typewoo = createTypewoo({...})`
- [ ] Remove any `Typewoo` / `Sdk` imports; import your created instance instead
- [ ] Update service calls from `Typewoo.store...` to `typewoo.store...`
- [ ] `await typewoo.ready` wherever you relied on `await Typewoo.init()` having
      loaded `state.authenticated`
- [ ] Replace `httpClient.interceptors...` with `typewoo.http.client.interceptors...`
- [ ] Remove calls to `createHttpClient()`, `getSdkConfig()` and `setSdkConfig()`
- [ ] (Multiple instances) switch custom `endpoints` to the factory form
- [ ] Replace `Admin*Request` types with `Admin*CreateRequest` /
      `Admin*UpdateRequest` (the old names are deprecated aliases)
- [ ] Replace removed shared types (`AdminAddress`, `AnalyticsLinks`, …) with
      the resource-specific ones
- [ ] Add fallbacks where you read response fields that are now optional
- [ ] Replace `analytics.categories.getStats()` with
      `analytics.products.getStats({ segmentby: 'category' })`
- [ ] Store product filters: pass `rating` as an array of numbers, and use
      `category` / `tag` / `brand` rather than `_unstable_tax_*` for those
      taxonomies
- [ ] Check code that reads `AdminOrder.refunds` (now `{ id, reason, total }`),
      order line item `price` (now a number) or analytics `getStats()`
      results (now per-report types)
- [ ] (Angular) drop the `provideAppInitializer(() => Typewoo.init(...))` provider;
      create the instance in a shared module instead

## 4.0.0-alpha.0 (2026-05-12)

### ✨ Highlights

- **Type definitions split into per-resource Zod schemas** (`*.schema.ts`,
  `*.query.schema.ts`) for store products, categories, tags, reviews,
  collection-data, and more — improving type inference. This was a breaking
  change; see the upgrade notes above.
- **Expanded WooCommerce Analytics** schemas and response types with detailed
  descriptions.
- **Schema-drift detection tooling** (`scripts/types-sync`) to keep SDK types in
  sync with upstream WooCommerce REST schemas (maintainer-facing).

### 🚀 Features

- update README to reflect new SDK structure and installation instructions ([334f8bd](https://github.com/typewoo/sdk/commit/334f8bd))
- add storage providers ([#111](https://github.com/typewoo/sdk/pull/111))
- add plugin updates ([0aa5ebe](https://github.com/typewoo/sdk/commit/0aa5ebe))
- allow custom axios configuration in SDK ([57f6fc4](https://github.com/typewoo/sdk/commit/57f6fc4))
- allow custom axios configuration in SDK ([#114](https://github.com/typewoo/sdk/pull/114))
- Enhance API services with RequestOptions for better request han… ([#116](https://github.com/typewoo/sdk/pull/116))
- add retry logic ([#118](https://github.com/typewoo/sdk/pull/118))
- add pagination loop function ([#138](https://github.com/typewoo/sdk/pull/138))
- export http helpers ([#139](https://github.com/typewoo/sdk/pull/139))
- introduce createTypewoo SDK initializer with configurable endpoints ([#141](https://github.com/typewoo/sdk/pull/141))
- add uniqueIdentifier option to SDK configuration for enhanced logging and debugging ([b4d65bf](https://github.com/typewoo/sdk/commit/b4d65bf))
- add global request lifecycle callbacks ([#148](https://github.com/typewoo/sdk/pull/148))
- split types and route coverage ([80d6b4d](https://github.com/typewoo/sdk/commit/80d6b4d))
- enhance analytics schemas and responses with detailed descriptions and new response structures ([f02b99d](https://github.com/typewoo/sdk/commit/f02b99d))
- updates ([39ea6f6](https://github.com/typewoo/sdk/commit/39ea6f6))
- add ignored files for ESLint configuration to exclude test directories ([3c8b5e4](https://github.com/typewoo/sdk/commit/3c8b5e4))
- update test paths to use new directory structure and add Vitest snapshots ([3f007cf](https://github.com/typewoo/sdk/commit/3f007cf))
- **analytics:** add comprehensive woocommerce analytics types and services ([df141d9](https://github.com/typewoo/sdk/commit/df141d9))
- **analytics:** add documentation for WooCommerce Analytics API and services ([29d2816](https://github.com/typewoo/sdk/commit/29d2816))
- **analytics:** update analytics types and services to include totals response and links schema ([fa6398b](https://github.com/typewoo/sdk/commit/fa6398b))
- **auth:** add first_name and last_name fields to AuthTokenResponseSchema ([d816587](https://github.com/typewoo/sdk/commit/d816587))
- **auth:** add clearSessionOnAuthChange option and refactor session clearing logic ([2ec262e](https://github.com/typewoo/sdk/commit/2ec262e))
- **brands:** update single method to accept both number and string as ID ([b05c6fa](https://github.com/typewoo/sdk/commit/b05c6fa))
- **cart:** define CartErrorResponse schema and update CartResponse to use it ([78bb952](https://github.com/typewoo/sdk/commit/78bb952))
- **config:** add suppressStorageWarnings option to SDK configuration and storage providers ([48059d8](https://github.com/typewoo/sdk/commit/48059d8))
- **interceptors:** enhance addRefreshTokenInterceptor to accept state and events parameters ([282ef74](https://github.com/typewoo/sdk/commit/282ef74))
- **interceptors:** enhance admin auth interceptor to support wc analytics endpoints ([03768b8](https://github.com/typewoo/sdk/commit/03768b8))
- **tests:** add comprehensive unit tests for introspect-zod, normalise, reconcile, and report modules ([86a0453](https://github.com/typewoo/sdk/commit/86a0453))
- **types-sync:** add support for version synchronization and testing ([3b44b8e](https://github.com/typewoo/sdk/commit/3b44b8e))
- **types-sync:** implement dynamic issue creation and updating for schema drift detection ([f16dc87](https://github.com/typewoo/sdk/commit/f16dc87))
- **types-sync:** add labels for schema drift detection issues ([418b721](https://github.com/typewoo/sdk/commit/418b721))
- **types-sync:** enhance issue body handling for schema drift reports ([5069c98](https://github.com/typewoo/sdk/commit/5069c98))
- **types-sync:** enhance schema drift report handling by uploading large reports as gists ([58aeed6](https://github.com/typewoo/sdk/commit/58aeed6))
- **types-sync:** enable gist uploads for large schema drift reports with PAT support ([7930d64](https://github.com/typewoo/sdk/commit/7930d64))

### 🩹 Fixes

- update zod peer dependency version to allow minor updates ([d7767ce](https://github.com/typewoo/sdk/commit/d7767ce))
- remove outdated entries from changelogs and pnpm-lock.yaml ([e0ccddc](https://github.com/typewoo/sdk/commit/e0ccddc))
- update pagination handling ([b13ec6e](https://github.com/typewoo/sdk/commit/b13ec6e))
- standardize 'TypeWoo' to 'Typewoo' across documentation and codebase ([b37eec2](https://github.com/typewoo/sdk/commit/b37eec2))
- implement retry logic with error handling in HTTP requests ([#120](https://github.com/typewoo/sdk/pull/120))
- update import paths to include file extension for consistency ([679e24d](https://github.com/typewoo/sdk/commit/679e24d))
- update import paths to include file extensions for consistency ([52aac22](https://github.com/typewoo/sdk/commit/52aac22))
- update `.js` imports and add missing `loop` function in product variations ([#140](https://github.com/typewoo/sdk/pull/140))
- update `attributes` and `variations` of product response type ([4b72494](https://github.com/typewoo/sdk/commit/4b72494))
- update `attributes` and `variations` types in ProductResponse docs ([b686aab](https://github.com/typewoo/sdk/commit/b686aab))
- refactor product response schema to use embedded attribute and variation types ([d2211eb](https://github.com/typewoo/sdk/commit/d2211eb))
- update price_range schema to use ProductPriceRangeResponseSchema ([166c62c](https://github.com/typewoo/sdk/commit/166c62c))
- define ProductPriceRangeResponse type for better type inference ([99ce866](https://github.com/typewoo/sdk/commit/99ce866))
- clean up JSON formatting and improve code readability in sync-all script ([9b9f959](https://github.com/typewoo/sdk/commit/9b9f959))
- split types ([448c35a](https://github.com/typewoo/sdk/commit/448c35a))
- update types ([59b2694](https://github.com/typewoo/sdk/commit/59b2694))
- enhance check command by adding no-endpoint-check option ([ab90a1a](https://github.com/typewoo/sdk/commit/ab90a1a))
- remove coverage flag from Vitest commands in CI workflow ([316aa40](https://github.com/typewoo/sdk/commit/316aa40))
- update flow test paths in CI workflows to new directory structure ([00e20f3](https://github.com/typewoo/sdk/commit/00e20f3))
- remove coverage thresholds from Vite configuration ([10def09](https://github.com/typewoo/sdk/commit/10def09))
- update pull request branch filters in CI workflow ([24e5c33](https://github.com/typewoo/sdk/commit/24e5c33))
- **auth:** always clear local tokens on revokeToken ([dc0716b](https://github.com/typewoo/sdk/commit/dc0716b))
- **auth:** add autoLoginUrl configuration option and related tests ([#149](https://github.com/typewoo/sdk/pull/149))
- **changelog:** correct formatting of analytics feature entry ([68de454](https://github.com/typewoo/sdk/commit/68de454))
- **deps:** update angular monorepo ([de7063a](https://github.com/typewoo/sdk/commit/de7063a))
- **deps:** update dependency qs to v6.14.1 ([40f49f3](https://github.com/typewoo/sdk/commit/40f49f3))
- **loop:** update loop extension to return only the last page's data ([8576aba](https://github.com/typewoo/sdk/commit/8576aba))
- **loop:** update tests to reflect that loopExtension returns only the last page's data ([def10c0](https://github.com/typewoo/sdk/commit/def10c0))
- **loop:** update tests to reflect that loopExtension returns only the last page's data ([6b970f1](https://github.com/typewoo/sdk/commit/6b970f1))
- **release:** update preVersionCommand to use specific build target ([0208d22](https://github.com/typewoo/sdk/commit/0208d22))
- **types-sync:** remove unnecessary isLoose parameter from severity calculation for missing-in-sdk drift ([2bd152f](https://github.com/typewoo/sdk/commit/2bd152f))

### ♻️ Code Refactoring

- allow unknown keys by switching to `z.looseObject()` ([8eeb214](https://github.com/typewoo/sdk/commit/8eeb214))
- update workflow steps for improved version handling and snapshot capturing ([e027693](https://github.com/typewoo/sdk/commit/e027693))
- remove outdated unit tests for store services and storage providers ([99c12b7](https://github.com/typewoo/sdk/commit/99c12b7))
- clean up unused imports and update test cases in integration and unit tests ([0522b31](https://github.com/typewoo/sdk/commit/0522b31))
- **product:** rename ProductQueryParams to AdminProductQueryParams for consistency ([eed8f80](https://github.com/typewoo/sdk/commit/eed8f80))
- **store:** convert StoreService to extend BaseService and implement lazy loading for services ([744941c](https://github.com/typewoo/sdk/commit/744941c))
- **types-sync:** streamline severity handling in diffPair function ([815efb0](https://github.com/typewoo/sdk/commit/815efb0))
- **types-sync:** improve code readability by formatting and restructuring multiline statements ([2ec640c](https://github.com/typewoo/sdk/commit/2ec640c))

### 🧹 Chores

- remove interceptor and config property ([72e8081](https://github.com/typewoo/sdk/commit/72e8081))
- plugin namespaces update ([e6ca5a6](https://github.com/typewoo/sdk/commit/e6ca5a6))
- enhance conventional commits configuration with chore and refactor types ([089e523](https://github.com/typewoo/sdk/commit/089e523))
- update README ([7f59f72](https://github.com/typewoo/sdk/commit/7f59f72))
- add pnpm-lock.yaml to .prettierignore ([8e77ffe](https://github.com/typewoo/sdk/commit/8e77ffe))
- update readme files ([4b28769](https://github.com/typewoo/sdk/commit/4b28769))
- **deps:** update angular-cli monorepo to v20.3.13 ([f22e07b](https://github.com/typewoo/sdk/commit/f22e07b))
- **deps:** update angular-cli monorepo to v20.3.13 ([#94](https://github.com/typewoo/sdk/pull/94))
- **deps:** update analog monorepo to ~1.22.0 ([941ad23](https://github.com/typewoo/sdk/commit/941ad23))
- **deps:** update dependency @playwright/test to v1.57.0 ([cd6f05b](https://github.com/typewoo/sdk/commit/cd6f05b))
- **deps:** update typescript-eslint monorepo to v8.50.0 ([f3a8744](https://github.com/typewoo/sdk/commit/f3a8744))
- **deps:** update dependency vite to v6.4.1 ([d5e5ab0](https://github.com/typewoo/sdk/commit/d5e5ab0))
- **deps:** update swc monorepo ([aa4b74a](https://github.com/typewoo/sdk/commit/aa4b74a))
- **deps:** update dependency autoprefixer to v10.4.23 ([10e20c6](https://github.com/typewoo/sdk/commit/10e20c6))
- **deps:** update dependency tailwindcss to v3.4.19 ([19779e7](https://github.com/typewoo/sdk/commit/19779e7))
- **deps:** update dependency ts-node to v10.9.2 ([bc3664c](https://github.com/typewoo/sdk/commit/bc3664c))
- **deps:** update dependency tsup to v8.5.1 ([6c8779d](https://github.com/typewoo/sdk/commit/6c8779d))
- **deps:** update typescript-eslint monorepo to v8.50.1 ([7e7cbf2](https://github.com/typewoo/sdk/commit/7e7cbf2))
- **deps:** update dependency ts-jest to v29.4.6 ([128ab1b](https://github.com/typewoo/sdk/commit/128ab1b))
- **deps:** update dependency jiti to v2.6.1 ([893236a](https://github.com/typewoo/sdk/commit/893236a))
- **deps:** update dependency angular-eslint to v20.7.0 ([ecdd8a3](https://github.com/typewoo/sdk/commit/ecdd8a3))
- **deps:** update dependency eslint-plugin-playwright to v2.5.1 ([a921a24](https://github.com/typewoo/sdk/commit/a921a24))
- **deps:** update dependency @swc/core to v1.15.11 ([46e9ec3](https://github.com/typewoo/sdk/commit/46e9ec3))
- **deps:** update dependency @types/node to v24.10.9 ([e8b7c44](https://github.com/typewoo/sdk/commit/e8b7c44))
- **deps:** update dependency jsonc-eslint-parser to v2.4.2 ([7f656b1](https://github.com/typewoo/sdk/commit/7f656b1))
- **deps:** update dependency axios to v1.15.0 ([fffc47b](https://github.com/typewoo/sdk/commit/fffc47b))
- **deps:** update swc monorepo ([4248ab9](https://github.com/typewoo/sdk/commit/4248ab9))
- **release:** publish 3.0.0 ([bb1f631](https://github.com/typewoo/sdk/commit/bb1f631))
- **release:** publish 3.1.0 ([6ed947f](https://github.com/typewoo/sdk/commit/6ed947f))
- **release:** publish 3.2.0 ([bd5056a](https://github.com/typewoo/sdk/commit/bd5056a))
- **release:** publish 3.3.0 ([35a6bbe](https://github.com/typewoo/sdk/commit/35a6bbe))
- **release:** publish 3.4.0 ([f0e09dd](https://github.com/typewoo/sdk/commit/f0e09dd))
- **release:** publish 3.5.0 ([c3708ea](https://github.com/typewoo/sdk/commit/c3708ea))
- **release:** publish 3.5.1 ([27127f0](https://github.com/typewoo/sdk/commit/27127f0))
- **release:** publish 3.5.2 ([65df334](https://github.com/typewoo/sdk/commit/65df334))
- **release:** publish 3.5.3 ([6611f1b](https://github.com/typewoo/sdk/commit/6611f1b))
- **release:** publish 3.5.4-beta.0 ([ee6c72f](https://github.com/typewoo/sdk/commit/ee6c72f))
- **release:** publish 3.5.4-beta.1 ([1237d8f](https://github.com/typewoo/sdk/commit/1237d8f))
- **release:** publish 3.5.4-beta.2 ([5a1c4c6](https://github.com/typewoo/sdk/commit/5a1c4c6))
- **release:** publish 3.5.4-beta.3 ([8e95d9e](https://github.com/typewoo/sdk/commit/8e95d9e))
- **release:** publish 3.5.4-beta.4 ([7007a8a](https://github.com/typewoo/sdk/commit/7007a8a))
- **release:** publish 3.5.4-beta.5 ([426c0a0](https://github.com/typewoo/sdk/commit/426c0a0))
- **release:** publish 3.5.4-beta.6 ([49272a3](https://github.com/typewoo/sdk/commit/49272a3))
- **release:** publish 3.5.4-beta.7 ([4c94e84](https://github.com/typewoo/sdk/commit/4c94e84))
- **release:** publish 3.6.0 ([0ea0d99](https://github.com/typewoo/sdk/commit/0ea0d99))
- **release:** publish 3.7.0 ([2a045b8](https://github.com/typewoo/sdk/commit/2a045b8))
- **release:** publish 3.7.1 ([f5bac93](https://github.com/typewoo/sdk/commit/f5bac93))
- **release:** publish 3.7.2 ([be2e270](https://github.com/typewoo/sdk/commit/be2e270))
- **release:** publish 3.7.3 ([7550861](https://github.com/typewoo/sdk/commit/7550861))
- **release:** publish 3.7.4 ([687080d](https://github.com/typewoo/sdk/commit/687080d))
- **release:** publish 3.7.5 ([f33ef3a](https://github.com/typewoo/sdk/commit/f33ef3a))
- **release:** publish 3.7.6 ([c376a50](https://github.com/typewoo/sdk/commit/c376a50))

## 3.7.6 (2026-04-25)

### 🚀 Features

- **config:** add suppressStorageWarnings option to SDK configuration and storage providers ([48059d8](https://github.com/typewoo/sdk/commit/48059d8))

### 🩹 Fixes

- **changelog:** correct formatting of analytics feature entry ([68de454](https://github.com/typewoo/sdk/commit/68de454))

## 3.7.5 (2026-04-18)

### 🚀 Features

- **analytics:** add comprehensive woocommerce analytics types and services ([df141d9](https://github.com/typewoo/sdk/commit/df141d9))
- **analytics:** add documentation for WooCommerce Analytics API and services ([29d2816](https://github.com/typewoo/sdk/commit/29d2816))
- **analytics:** update analytics types and services to include totals response and links schema ([fa6398b](https://github.com/typewoo/sdk/commit/fa6398b))
- **interceptors:** enhance admin auth interceptor to support wc analytics endpoints ([03768b8](https://github.com/typewoo/sdk/commit/03768b8))

### 🩹 Fixes

- **release:** update preVersionCommand to use specific build target ([0208d22](https://github.com/typewoo/sdk/commit/0208d22))

### ♻️ Code Refactoring

- **store:** convert StoreService to extend BaseService and implement lazy loading for services ([744941c](https://github.com/typewoo/sdk/commit/744941c))

### 🧹 Chores

- **deps:** update dependency jsonc-eslint-parser to v2.4.2 ([7f656b1](https://github.com/typewoo/sdk/commit/7f656b1))
- **deps:** update dependency axios to v1.15.0 ([fffc47b](https://github.com/typewoo/sdk/commit/fffc47b))
- **deps:** update swc monorepo ([4248ab9](https://github.com/typewoo/sdk/commit/4248ab9))

## 3.7.4 (2026-03-20)

### 🩹 Fixes

- update price_range schema to use ProductPriceRangeResponseSchema ([166c62c](https://github.com/typewoo/sdk/commit/166c62c))
- define ProductPriceRangeResponse type for better type inference ([99ce866](https://github.com/typewoo/sdk/commit/99ce866))

## 3.7.3 (2026-03-19)

### 🩹 Fixes

- refactor product response schema to use embedded attribute and variation types ([d2211eb](https://github.com/typewoo/sdk/commit/d2211eb))

## 3.7.2 (2026-03-19)

### 🩹 Fixes

- update `attributes` and `variations` of product response type ([4b72494](https://github.com/typewoo/sdk/commit/4b72494))
- update `attributes` and `variations` types in ProductResponse docs ([b686aab](https://github.com/typewoo/sdk/commit/b686aab))

## 3.7.1 (2026-03-03)

### 🩹 Fixes

- **auth:** add autoLoginUrl configuration option and related tests ([#149](https://github.com/typewoo/sdk/pull/149))

## 3.7.0 (2026-02-16)

### 🚀 Features

- add global request lifecycle callbacks ([#148](https://github.com/typewoo/sdk/pull/148))

### 🩹 Fixes

- **deps:** update dependency qs to v6.14.1 ([40f49f3](https://github.com/typewoo/sdk/commit/40f49f3))

### 🧹 Chores

- **deps:** update dependency angular-eslint to v20.7.0 ([ecdd8a3](https://github.com/typewoo/sdk/commit/ecdd8a3))
- **deps:** update dependency eslint-plugin-playwright to v2.5.1 ([a921a24](https://github.com/typewoo/sdk/commit/a921a24))
- **deps:** update dependency @swc/core to v1.15.11 ([46e9ec3](https://github.com/typewoo/sdk/commit/46e9ec3))
- **deps:** update dependency @types/node to v24.10.9 ([e8b7c44](https://github.com/typewoo/sdk/commit/e8b7c44))

## 3.6.0 (2026-01-27)

### 🚀 Features

- introduce createTypewoo SDK initializer with configurable endpoints ([#141](https://github.com/typewoo/sdk/pull/141))
- add uniqueIdentifier option to SDK configuration for enhanced logging and debugging ([b4d65bf](https://github.com/typewoo/sdk/commit/b4d65bf))
- **auth:** add first_name and last_name fields to AuthTokenResponseSchema ([d816587](https://github.com/typewoo/sdk/commit/d816587))
- **auth:** add clearSessionOnAuthChange option and refactor session clearing logic ([2ec262e](https://github.com/typewoo/sdk/commit/2ec262e))
- **brands:** update single method to accept both number and string as ID ([b05c6fa](https://github.com/typewoo/sdk/commit/b05c6fa))
- **cart:** define CartErrorResponse schema and update CartResponse to use it ([78bb952](https://github.com/typewoo/sdk/commit/78bb952))
- **interceptors:** enhance addRefreshTokenInterceptor to accept state and events parameters ([282ef74](https://github.com/typewoo/sdk/commit/282ef74))

### 🩹 Fixes

- **auth:** always clear local tokens on revokeToken ([dc0716b](https://github.com/typewoo/sdk/commit/dc0716b))
- **loop:** update loop extension to return only the last page's data ([8576aba](https://github.com/typewoo/sdk/commit/8576aba))
- **loop:** update tests to reflect that loopExtension returns only the last page's data ([def10c0](https://github.com/typewoo/sdk/commit/def10c0))
- **loop:** update tests to reflect that loopExtension returns only the last page's data ([6b970f1](https://github.com/typewoo/sdk/commit/6b970f1))

### 🧹 Chores

- update readme files ([4b28769](https://github.com/typewoo/sdk/commit/4b28769))
- **release:** publish 3.5.4-beta.0 ([ee6c72f](https://github.com/typewoo/sdk/commit/ee6c72f))
- **release:** publish 3.5.4-beta.1 ([1237d8f](https://github.com/typewoo/sdk/commit/1237d8f))
- **release:** publish 3.5.4-beta.2 ([5a1c4c6](https://github.com/typewoo/sdk/commit/5a1c4c6))
- **release:** publish 3.5.4-beta.3 ([8e95d9e](https://github.com/typewoo/sdk/commit/8e95d9e))
- **release:** publish 3.5.4-beta.4 ([7007a8a](https://github.com/typewoo/sdk/commit/7007a8a))
- **release:** publish 3.5.4-beta.5 ([426c0a0](https://github.com/typewoo/sdk/commit/426c0a0))
- **release:** publish 3.5.4-beta.6 ([49272a3](https://github.com/typewoo/sdk/commit/49272a3))
- **release:** publish 3.5.4-beta.7 ([4c94e84](https://github.com/typewoo/sdk/commit/4c94e84))

## 3.5.4-beta.7 (2026-01-27)

### 🚀 Features

- **brands:** update single method to accept both number and string as ID ([b05c6fa](https://github.com/typewoo/sdk/commit/b05c6fa))

## 3.5.4-beta.6 (2026-01-26)

### 🚀 Features

- **cart:** define CartErrorResponse schema and update CartResponse to use it ([78bb952](https://github.com/typewoo/sdk/commit/78bb952))

## 3.5.4-beta.5 (2026-01-22)

### 🚀 Features

- **auth:** add clearSessionOnAuthChange option and refactor session clearing logic ([2ec262e](https://github.com/typewoo/sdk/commit/2ec262e))
- **interceptors:** enhance addRefreshTokenInterceptor to accept state and events parameters ([282ef74](https://github.com/typewoo/sdk/commit/282ef74))

## 3.5.4-beta.4 (2026-01-22)

### 🩹 Fixes

- **auth:** always clear local tokens on revokeToken ([dc0716b](https://github.com/typewoo/sdk/commit/dc0716b))
- **loop:** update tests to reflect that loopExtension returns only the last page's data ([def10c0](https://github.com/typewoo/sdk/commit/def10c0))
- **loop:** update tests to reflect that loopExtension returns only the last page's data ([6b970f1](https://github.com/typewoo/sdk/commit/6b970f1))

## 3.5.4-beta.3 (2026-01-20)

### 🚀 Features

- **auth:** add first_name and last_name fields to AuthTokenResponseSchema ([d816587](https://github.com/typewoo/sdk/commit/d816587))

## 3.5.4-beta.2 (2026-01-20)

### 🩹 Fixes

- **loop:** update loop extension to return only the last page's data ([8576aba](https://github.com/typewoo/sdk/commit/8576aba))

## 3.5.4-beta.1 (2026-01-19)

### 🚀 Features

- add uniqueIdentifier option to SDK configuration for enhanced logging and debugging ([b4d65bf](https://github.com/typewoo/sdk/commit/b4d65bf))

### 🧹 Chores

- update readme files ([4b28769](https://github.com/typewoo/sdk/commit/4b28769))

## 3.5.4-beta.0 (2026-01-16)

### 🚀 Features

- introduce createTypewoo SDK initializer with configurable endpoints ([#141](https://github.com/typewoo/sdk/pull/141))

## 3.5.3 (2026-01-02)

### 🩹 Fixes

- update `.js` imports and add missing `loop` function in product variations ([#140](https://github.com/typewoo/sdk/pull/140))

## 3.5.2 (2026-01-02)

### 🩹 Fixes

- update import paths to include file extensions for consistency ([52aac22](https://github.com/typewoo/sdk/commit/52aac22))

## 3.5.1 (2026-01-02)

### 🩹 Fixes

- update import paths to include file extension for consistency ([679e24d](https://github.com/typewoo/sdk/commit/679e24d))

## 3.5.0 (2026-01-02)

### 🚀 Features

- export http helpers ([#139](https://github.com/typewoo/sdk/pull/139))

## 3.4.0 (2026-01-02)

### 🚀 Features

- add pagination loop function ([#138](https://github.com/typewoo/sdk/pull/138))

### 🩹 Fixes

- standardize 'TypeWoo' to 'Typewoo' across documentation and codebase ([b37eec2](https://github.com/typewoo/sdk/commit/b37eec2))
- implement retry logic with error handling in HTTP requests ([#120](https://github.com/typewoo/sdk/pull/120))
- **deps:** update angular monorepo ([de7063a](https://github.com/typewoo/sdk/commit/de7063a))

### 🧹 Chores

- update README ([7f59f72](https://github.com/typewoo/sdk/commit/7f59f72))
- add pnpm-lock.yaml to .prettierignore ([8e77ffe](https://github.com/typewoo/sdk/commit/8e77ffe))
- **deps:** update angular-cli monorepo to v20.3.13 ([f22e07b](https://github.com/typewoo/sdk/commit/f22e07b))
- **deps:** update angular-cli monorepo to v20.3.13 ([#94](https://github.com/typewoo/sdk/pull/94))
- **deps:** update analog monorepo to ~1.22.0 ([941ad23](https://github.com/typewoo/sdk/commit/941ad23))
- **deps:** update dependency @playwright/test to v1.57.0 ([cd6f05b](https://github.com/typewoo/sdk/commit/cd6f05b))
- **deps:** update typescript-eslint monorepo to v8.50.0 ([f3a8744](https://github.com/typewoo/sdk/commit/f3a8744))
- **deps:** update dependency vite to v6.4.1 ([d5e5ab0](https://github.com/typewoo/sdk/commit/d5e5ab0))
- **deps:** update swc monorepo ([aa4b74a](https://github.com/typewoo/sdk/commit/aa4b74a))
- **deps:** update dependency autoprefixer to v10.4.23 ([10e20c6](https://github.com/typewoo/sdk/commit/10e20c6))
- **deps:** update dependency tailwindcss to v3.4.19 ([19779e7](https://github.com/typewoo/sdk/commit/19779e7))
- **deps:** update dependency ts-node to v10.9.2 ([bc3664c](https://github.com/typewoo/sdk/commit/bc3664c))
- **deps:** update dependency tsup to v8.5.1 ([6c8779d](https://github.com/typewoo/sdk/commit/6c8779d))
- **deps:** update typescript-eslint monorepo to v8.50.1 ([7e7cbf2](https://github.com/typewoo/sdk/commit/7e7cbf2))
- **deps:** update dependency ts-jest to v29.4.6 ([128ab1b](https://github.com/typewoo/sdk/commit/128ab1b))
- **deps:** update dependency jiti to v2.6.1 ([893236a](https://github.com/typewoo/sdk/commit/893236a))

## 3.3.0 (2025-12-15)

### 🚀 Features

- Enhance API services with RequestOptions for better request han… ([#116](https://github.com/typewoo/sdk/pull/116))
- add retry logic ([#118](https://github.com/typewoo/sdk/pull/118))

### ♻️ Code Refactoring

- allow unknown keys by switching to `z.looseObject()` ([8eeb214](https://github.com/typewoo/sdk/commit/8eeb214))

### 🧹 Chores

- enhance conventional commits configuration with chore and refactor types ([089e523](https://github.com/typewoo/sdk/commit/089e523))

## 3.2.0 (2025-12-12)

### 🚀 Features

- add plugin updates ([0aa5ebe](https://github.com/typewoo/sdk/commit/0aa5ebe))
- allow custom axios configuration in SDK ([57f6fc4](https://github.com/typewoo/sdk/commit/57f6fc4))
- allow custom axios configuration in SDK ([#114](https://github.com/typewoo/sdk/pull/114))

### 🩹 Fixes

- update pagination handling ([b13ec6e](https://github.com/typewoo/sdk/commit/b13ec6e))

### ❤️ Thank You

- kmakris23
- Kostas Makris @kmakris23

## 3.1.0 (2025-12-06)

### 🚀 Features

- update README to reflect new SDK structure and installation instructions ([334f8bd](https://github.com/typewoo/sdk/commit/334f8bd))
- add storage providers ([#111](https://github.com/typewoo/sdk/pull/111))

### ❤️ Thank You

- kmakris23
- Kostas Makris @kmakris23

# 3.0.0 (2025-12-02)

### 🚀 Features

- admin rest api ([3c54247](https://github.com/typewoo/sdk/commit/3c54247))
- improve application password export process with temporary file handling ([d4b3524](https://github.com/typewoo/sdk/commit/d4b3524))
- add dotenv support for environment variable management in integration tests ([619f385](https://github.com/typewoo/sdk/commit/619f385))
- add dotenv configuration for environment variable management in customer checkout tests ([aa43408](https://github.com/typewoo/sdk/commit/aa43408))
- implement Batch and Cart Extensions APIs with integration tests ([57d20cb](https://github.com/typewoo/sdk/commit/57d20cb))
- api snapshots ([fa2e748](https://github.com/typewoo/sdk/commit/fa2e748))
- enhance authentication endpoint handling with support for glob patterns ([ecbcc77](https://github.com/typewoo/sdk/commit/ecbcc77))
- update types and add nestjs app ([0eee2dd](https://github.com/typewoo/sdk/commit/0eee2dd))

### 🩹 Fixes

- update passwords file path to use temporary directory ([6f53d84](https://github.com/typewoo/sdk/commit/6f53d84))
- update password extraction process and script execution order ([115adba](https://github.com/typewoo/sdk/commit/115adba))
- clean up WordPress environment teardown and improve logging during plugin tests ([387a7aa](https://github.com/typewoo/sdk/commit/387a7aa))
- update build job dependencies and improve password handling script ([8f63b73](https://github.com/typewoo/sdk/commit/8f63b73))
- enhance validation for invalid namespace in Cart Extensions API tests ([b863699](https://github.com/typewoo/sdk/commit/b863699))
- update controller routes to include 'wp-json' prefix ([dd6e002](https://github.com/typewoo/sdk/commit/dd6e002))
- add missing newline at end of package.json ([e475e36](https://github.com/typewoo/sdk/commit/e475e36))
- add missing newline at end of package.json ([689a54f](https://github.com/typewoo/sdk/commit/689a54f))
- tests ([5ff6dfd](https://github.com/typewoo/sdk/commit/5ff6dfd))
- update vitest command to use specific config for unit tests ([965f319](https://github.com/typewoo/sdk/commit/965f319))
- update package names from @typewoo/core to @typewoo/sdk ([e5a5ecf](https://github.com/typewoo/sdk/commit/e5a5ecf))
- update import path for CartResponseSchema to include file extension ([b4b381a](https://github.com/typewoo/sdk/commit/b4b381a))
- update workflows to use Node.js 24 and pnpm for dependency management ([da5e385](https://github.com/typewoo/sdk/commit/da5e385))
- update zod peer dependency version to allow minor updates ([d7767ce](https://github.com/typewoo/sdk/commit/d7767ce))
- remove outdated entries from changelogs and pnpm-lock.yaml ([e0ccddc](https://github.com/typewoo/sdk/commit/e0ccddc))

### ❤️ Thank You

- kmakris23

## 3.0.0-alpha.1 (2025-11-25)

### 🚀 Features

- admin rest api ([3c54247](https://github.com/typewoo/sdk/commit/3c54247))
- improve application password export process with temporary file handling ([d4b3524](https://github.com/typewoo/sdk/commit/d4b3524))
- add dotenv support for environment variable management in integration tests ([619f385](https://github.com/typewoo/sdk/commit/619f385))
- add dotenv configuration for environment variable management in customer checkout tests ([aa43408](https://github.com/typewoo/sdk/commit/aa43408))
- implement Batch and Cart Extensions APIs with integration tests ([57d20cb](https://github.com/typewoo/sdk/commit/57d20cb))
- api snapshots ([fa2e748](https://github.com/typewoo/sdk/commit/fa2e748))
- enhance authentication endpoint handling with support for glob patterns ([ecbcc77](https://github.com/typewoo/sdk/commit/ecbcc77))

### 🩹 Fixes

- update passwords file path to use temporary directory ([6f53d84](https://github.com/typewoo/sdk/commit/6f53d84))
- update password extraction process and script execution order ([115adba](https://github.com/typewoo/sdk/commit/115adba))
- clean up WordPress environment teardown and improve logging during plugin tests ([387a7aa](https://github.com/typewoo/sdk/commit/387a7aa))
- update build job dependencies and improve password handling script ([8f63b73](https://github.com/typewoo/sdk/commit/8f63b73))
- enhance validation for invalid namespace in Cart Extensions API tests ([b863699](https://github.com/typewoo/sdk/commit/b863699))
- update controller routes to include 'wp-json' prefix ([dd6e002](https://github.com/typewoo/sdk/commit/dd6e002))
- add missing newline at end of package.json ([e475e36](https://github.com/typewoo/sdk/commit/e475e36))
- add missing newline at end of package.json ([689a54f](https://github.com/typewoo/sdk/commit/689a54f))
- tests ([5ff6dfd](https://github.com/typewoo/sdk/commit/5ff6dfd))
- update vitest command to use specific config for unit tests ([965f319](https://github.com/typewoo/sdk/commit/965f319))
- update package names from @typewoo/core to @typewoo/sdk ([e5a5ecf](https://github.com/typewoo/sdk/commit/e5a5ecf))
- update import path for CartResponseSchema to include file extension ([b4b381a](https://github.com/typewoo/sdk/commit/b4b381a))
- update workflows to use Node.js 24 and pnpm for dependency management ([da5e385](https://github.com/typewoo/sdk/commit/da5e385))

### ❤️ Thank You

- kmakris23

## 2.1.0 (2025-09-16)

### 🚀 Features

- **plugin:** implement tracking functionality ([bf7e738](https://github.com/typewoo/sdk/commit/bf7e738))

### ❤️ Thank You

- Kostas Makris @kmakris23

## 2.0.1-alpha.0 (2025-09-15)

### 🚀 Features

- **typewoo:** add initialization flag to prevent double initialization in Typewoo ([31cc4cd](https://github.com/typewoo/sdk/commit/31cc4cd))
- **tracking:** implement tracking functionality and enhance auto-login URL generation ([fa71133](https://github.com/typewoo/sdk/commit/fa71133))

### 🩹 Fixes

- **auth:** correct default value for trackingParams in getAutoLoginUrl method ([ac5641f](https://github.com/typewoo/sdk/commit/ac5641f))
- **package-plugin:** prioritize PowerShell over tar for Windows packaging ([6655d71](https://github.com/typewoo/sdk/commit/6655d71))
- **tracking:** sanitize request URI before checking against whitelisted paths ([6f70b45](https://github.com/typewoo/sdk/commit/6f70b45))

### ❤️ Thank You

- kmakris23

# 2.0.0 (2025-09-10)

### 🚀 Features

- create comprehensive README.md with detailed documentation ([d466536](https://github.com/typewoo/sdk/commit/d466536))
- Implement enhanced plugin architecture with event handler registration and include Angular example in CI builds ([fcf9ac3](https://github.com/typewoo/sdk/commit/fcf9ac3))
- enhance cart and order integration tests, improve error handling and assertions ([649641d](https://github.com/typewoo/sdk/commit/649641d))
- ⚠️ unify authentication in core package and introduce WordPress plugin ([74ede26](https://github.com/typewoo/sdk/commit/74ede26))

### 🩹 Fixes

- **deps:** update angular monorepo to ~20.2.0 ([823cb86](https://github.com/typewoo/sdk/commit/823cb86))

### ⚠️ Breaking Changes

- ⚠️ unify authentication in core package and introduce WordPress plugin ([74ede26](https://github.com/typewoo/sdk/commit/74ede26))

### ❤️ Thank You

- Copilot @Copilot
- kmakris23
- Kostas Makris @kmakris23

## 1.3.5-alpha.5 (2025-09-10)

### 🚀 Features

- **auth:** update getAutoLoginUrl parameter names for consistency ([60a6ad2](https://github.com/typewoo/sdk/commit/60a6ad2))
- **deps:** add React and ReactDOM with peer dependencies ([343adad](https://github.com/typewoo/sdk/commit/343adad))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.4 (2025-09-10)

### 🚀 Features

- **auth:** update getAutoLoginUrl to accept ott parameter for token generation ([c405c12](https://github.com/typewoo/sdk/commit/c405c12))
- **auth:** refactor getAutoLoginUrl tests to directly pass token and redirectUrl ([43beb57](https://github.com/typewoo/sdk/commit/43beb57))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.3 (2025-09-10)

### 🚀 Features

- **auth:** update getAutoLoginUrl to require redirectUrl and improve URL generation ([07af077](https://github.com/typewoo/sdk/commit/07af077))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.2 (2025-09-10)

### 🚀 Features

- **deps:** add React and ReactDOM with peer dependencies, remove dev flags from several packages ([ff699a9](https://github.com/typewoo/sdk/commit/ff699a9))
- **interceptors:** enhance refresh token handling with queue management and state reset functionality ([b296d14](https://github.com/typewoo/sdk/commit/b296d14))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.1 (2025-09-10)

### 🚀 Features

- **auth:** implement force authentication for specific endpoints ([f0a1740](https://github.com/typewoo/sdk/commit/f0a1740))
- **auth:** add test endpoint for force authentication and update deployment guide ([547bb91](https://github.com/typewoo/sdk/commit/547bb91))
- **auth:** improve token handling by ensuring async token and refresh token setting ([c7723c8](https://github.com/typewoo/sdk/commit/c7723c8))

### ❤️ Thank You

- kmakris23

## 1.3.5-alpha.0 (2025-09-09)

This was a version bump only, there were no code changes.

## 1.3.4-alpha.0 (2025-09-08)

This was a version bump only, there were no code changes.

## 1.3.3-alpha.0 (2025-09-08)

### 🚀 Features

- **auth:** initialize authentication state based on provided token ([442c25f](https://github.com/typewoo/sdk/commit/442c25f))

### 🩹 Fixes

- **auth:** correct token retrieval logic in refresh token interceptor ([1a491d6](https://github.com/typewoo/sdk/commit/1a491d6))

### ❤️ Thank You

- kmakris23

## 1.3.2-alpha.0 (2025-09-08)

### 🚀 Features

- **auth:** add support for setting refresh token in token response ([91f13bf](https://github.com/typewoo/sdk/commit/91f13bf))

### ❤️ Thank You

- kmakris23

## 1.3.1-alpha.0 (2025-09-08)

### 🚀 Features

- **auth:** enhance authentication flow with token management and auto-login URL ([4ee683b](https://github.com/typewoo/sdk/commit/4ee683b))

### ❤️ Thank You

- kmakris23

## 1.3.0-alpha.0 (2025-09-08)

This was a version bump only, there were no code changes.

## 1.2.0-alpha.0 (2025-09-08)

### 🚀 Features

- create comprehensive README.md with detailed documentation ([d466536](https://github.com/typewoo/sdk/commit/d466536))
- Implement enhanced plugin architecture with event handler registration and include Angular example in CI builds ([fcf9ac3](https://github.com/typewoo/sdk/commit/fcf9ac3))
- enhance cart and order integration tests, improve error handling and assertions ([649641d](https://github.com/typewoo/sdk/commit/649641d))
- Implement Typewoo JWT Authentication Plugin ([098a02a](https://github.com/typewoo/sdk/commit/098a02a))
- Refactor Typewoo authentication plugin structure and update documentation for unified JWT support ([b39db7f](https://github.com/typewoo/sdk/commit/b39db7f))
- Add JWT support configuration and enhance user creation logic in setup script ([853a08b](https://github.com/typewoo/sdk/commit/853a08b))
- **auth:** implement token management and refresh functionality ([3511c31](https://github.com/typewoo/sdk/commit/3511c31))

### 🩹 Fixes

- Adjust table formatting in README for clarity on recommended approaches ([92ccab5](https://github.com/typewoo/sdk/commit/92ccab5))
- **deps:** update angular monorepo to ~20.2.0 ([823cb86](https://github.com/typewoo/sdk/commit/823cb86))
- **package:** add missing newline at end of file ([1d6fc0a](https://github.com/typewoo/sdk/commit/1d6fc0a))

### ❤️ Thank You

- Copilot @Copilot
- kmakris23

## 1.1.1 (2025-08-20)

### 🩹 Fixes

- update `simpleJwt` interface ([65a9c82](https://github.com/typewoo/sdk/commit/65a9c82))

### ❤️ Thank You

- Kostas Makris

## 1.1.0 (2025-08-20)

### 🚀 Features

- **simple-jwt-login:** add `redirectUrl` optional parameter to `getAutoLoginUrl` method ([5aa0a47](https://github.com/typewoo/sdk/commit/5aa0a47))

### ❤️ Thank You

- Kostas Makris

## 1.0.1 (2025-08-13)

### 🩹 Fixes

- **core:** always clear `nonce` and `cartToken` when auth change to `false` ([7dc98cd](https://github.com/typewoo/sdk/commit/7dc98cd))
- **core:** remove `simple-jwt-login` interceptor ([4104c9a](https://github.com/typewoo/sdk/commit/4104c9a))

### ❤️ Thank You

- Kostas Makris

# 1.0.0 (2025-08-12)

### 🚀 Features

- ⚠️ new event bus implementation ([53b0207](https://github.com/typewoo/sdk/commit/53b0207))
- **core:** add clear token function for `nonce` and `cartToken` ([da7f519](https://github.com/typewoo/sdk/commit/da7f519))
- **core:** add specific `simple-jwt-login` plugin interceptor ([7a5d061](https://github.com/typewoo/sdk/commit/7a5d061))
- ⚠️ **core:** move store api services under `store` property ([2978784](https://github.com/typewoo/sdk/commit/2978784))
- **simple-jwt-login:** automatically call `clearToken()` on token revoke success ([33c35c3](https://github.com/typewoo/sdk/commit/33c35c3))
- **simple-jwt-login:** add `fetchCartOnLogin` to automatically fetch cart after login and automatically remove `nonce` and `cartToken` on each logout ([fb6e964](https://github.com/typewoo/sdk/commit/fb6e964))
- **simple-jwt-login:** add `revokeTokenBeforeLogin` to automatically revoke token before each new login ([079128e](https://github.com/typewoo/sdk/commit/079128e))

### 🩹 Fixes

- **core:** use `simple-jwt-login` config for interceptor ([c57ed92](https://github.com/typewoo/sdk/commit/c57ed92))

### ⚠️ Breaking Changes

- New event bus has been implemented replacing the previous event emitter.
- **core:** Store API services have been moved under `store` property in `Typewoo`.

### ❤️ Thank You

- Kostas Makris

## 0.9.1 (2025-08-06)

### 🩹 Fixes

- **auth:** update getAutoLoginUrl to include route namespace in the endpoint ([af91110](https://github.com/typewoo/sdk/commit/af91110))

### ❤️ Thank You

- Kostas Makris

## 0.9.0 (2025-08-06)

### 🚀 Features

- **auth:** add getAutoLoginUrl method and autoLoginUrl config option ([05d549b](https://github.com/typewoo/sdk/commit/05d549b))

### ❤️ Thank You

- Kostas Makris

## 0.8.5 (2025-08-06)

### 🩹 Fixes

- **auth:** make body parameter optional in revokeToken method ([ddc0a83](https://github.com/typewoo/sdk/commit/ddc0a83))
- **axios:** ensure options are spread correctly in doRequest function ([26e6297](https://github.com/typewoo/sdk/commit/26e6297))

### ❤️ Thank You

- Kostas Makris

## 0.8.4 (2025-08-06)

### 🩹 Fixes

- **auth, user:** add options parameter to service methods for better request configuration ([224d42d](https://github.com/typewoo/sdk/commit/224d42d))

### ❤️ Thank You

- Kostas Makris

## 0.8.3 (2025-08-06)

### 🩹 Fixes

- **simple-jwt-login:** refresh-token: improve error handling by ensuring originalRequest is validated before processing 401 responses ([0299667](https://github.com/typewoo/sdk/commit/0299667))

### ❤️ Thank You

- Kostas Makris

## 0.8.2 (2025-08-06)

### 🩹 Fixes

- **refresh-token:** ensure config is passed to refreshTokenFailed for better error handling ([276e168](https://github.com/typewoo/sdk/commit/276e168))

### ❤️ Thank You

- Kostas Makris

## 0.8.1 (2025-08-06)

### 🩹 Fixes

- **simple-jwt:** add initial authentication state setup in plugin initialization ([b7bc0bb](https://github.com/typewoo/sdk/commit/b7bc0bb))

### ❤️ Thank You

- Kostas Makris

## 0.8.0 (2025-08-06)

### 🚀 Features

- **auth:** enhance authentication handling and state management ([ec53370](https://github.com/typewoo/sdk/commit/ec53370))

### ❤️ Thank You

- Kostas Makris

## 0.7.0 (2025-08-05)

### 🚀 Features

- **core:** enhance API services to support pagination in responses ([b6fbdad](https://github.com/typewoo/sdk/commit/b6fbdad))

### ❤️ Thank You

- Kostas Makris

## 0.6.1 (2025-08-05)

### 🩹 Fixes

- **core:** remove debug log from doRequest function ([001f0e8](https://github.com/typewoo/sdk/commit/001f0e8))

### ❤️ Thank You

- Kostas Makris

## 0.6.0 (2025-08-05)

### 🚀 Features

- conditional use interceptors ([ff12114](https://github.com/typewoo/sdk/commit/ff12114))
- **nx-cloud:** setup nx cloud workspace ([79caf69](https://github.com/typewoo/sdk/commit/79caf69))

### 🩹 Fixes

- **constants:** remove trailing slash from DEFAULT_ROUTE_NAMESPACE ([1fab969](https://github.com/typewoo/sdk/commit/1fab969))

### ❤️ Thank You

- Kostas Makris @kmakris23

## 0.5.0 (2025-08-04)

### 🚀 Features

- add simple-jwt-login plugin package ([1435f8c](https://github.com/typewoo/sdk/commit/1435f8c))

### 🩹 Fixes

- **core:** update `nonce` token regularly ([636a353](https://github.com/typewoo/sdk/commit/636a353))

### ❤️ Thank You

- Kostas Makris

## 0.4.3 (2025-08-03)

### 🩹 Fixes

- remove `development` export ([42a5acd](https://github.com/typewoo/sdk/commit/42a5acd))

### ❤️ Thank You

- Kostas Makris

## 0.4.2 (2025-08-03)

### 🩹 Fixes

- `vite.config.ts` preserveSymlinks ([35ec66a](https://github.com/typewoo/sdk/commit/35ec66a))

### ❤️ Thank You

- Kostas Makris

## 0.4.1 (2025-08-02)

### 🩹 Fixes

- release config ([8012816](https://github.com/typewoo/sdk/commit/8012816))
- **core:** add jwt utilities ([9cb9bea](https://github.com/typewoo/sdk/commit/9cb9bea))

### ❤️ Thank You

- Kostas Makris

## 0.4.1-0 (2025-08-02)

### 🚀 Features

- scaffold `jwt-authentication-for-wp-rest-api` package ([6d04e5b](https://github.com/typewoo/sdk/commit/6d04e5b))
- add JWT Authentication for WP REST API plugin ([6fc570a](https://github.com/typewoo/sdk/commit/6fc570a))

### 🩹 Fixes

- **core:** singleton axios instance, remove `baseUrl` usages and move plugin load into config ([75897e2](https://github.com/typewoo/sdk/commit/75897e2))
- **hippoo:** load plugin using `useHippoo` and use specific `HippoConfig` ([11bdd66](https://github.com/typewoo/sdk/commit/11bdd66))

### ❤️ Thank You

- Kostas Makris

## 0.4.0 (2025-07-31)

### 🚀 Features

- plugins and hippoo integration ([db49ba2](https://github.com/typewoo/sdk/commit/db49ba2))

### ❤️ Thank You

- Kostas Makris

## 0.3.0 (2025-07-31)

### 🚀 Features

- add `cartLoading` event ([5909a7e](https://github.com/typewoo/sdk/commit/5909a7e))

### ❤️ Thank You

- Kostas Makris

## 0.2.6 (2025-07-30)

### 🩹 Fixes

- pass correct axios instance options ([ae3f1ce](https://github.com/typewoo/sdk/commit/ae3f1ce))

### ❤️ Thank You

- Kostas Makris

## 0.2.5 (2025-07-30)

### 🩹 Fixes

- `cartChanged` value comparison ([a221a2a](https://github.com/typewoo/sdk/commit/a221a2a))

### ❤️ Thank You

- Kostas Makris

## 0.2.4 (2025-07-29)

### 🩹 Fixes

- use `await` ([0c1fafd](https://github.com/typewoo/sdk/commit/0c1fafd))

### ❤️ Thank You

- Kostas Makris

## 0.2.3 (2025-07-29)

### 🩹 Fixes

- query parameters ([9af8088](https://github.com/typewoo/sdk/commit/9af8088))

### ❤️ Thank You

- Kostas Makris

## 0.2.2 (2025-07-29)

### 🩹 Fixes

- update `nonce` and `cartToken` only when missing ([368f6dc](https://github.com/typewoo/sdk/commit/368f6dc))
- add missing request headers ([75d7e5f](https://github.com/typewoo/sdk/commit/75d7e5f))

### ❤️ Thank You

- Kostas Makris

## 0.2.1 (2025-07-29)

### 🩹 Fixes

- add missing `setToken` and `getToken` functions ([7d51f3b](https://github.com/typewoo/sdk/commit/7d51f3b))

### ❤️ Thank You

- Kostas Makris

## 0.2.0 (2025-07-29)

### 🚀 Features

- simpify requests, track `cart`, `nonce` and `cart` changes ([3276260](https://github.com/typewoo/sdk/commit/3276260))

### 🩹 Fixes

- add missing cart response properties ([239b1e9](https://github.com/typewoo/sdk/commit/239b1e9))

### ❤️ Thank You

- Kostas Makris

## 0.1.1 (2025-07-29)

### 🩹 Fixes

- bump version ([6089119](https://github.com/typewoo/sdk/commit/6089119))

### ❤️ Thank You

- Kostas Makris

## 0.1.0 (2025-07-29)

### 🚀 Features

- event emitters and api updates ([ed4f58d](https://github.com/typewoo/sdk/commit/ed4f58d))

### ❤️ Thank You

- Kostas Makris

## 0.0.16 (2025-07-27)

### 🩹 Fixes

- update `ApiResult` type ([2cec47a](https://github.com/typewoo/sdk/commit/2cec47a))

### ❤️ Thank You

- Kostas Makris

## 0.0.15 (2025-07-27)

### 🩹 Fixes

- convert service calls to `async` ([ed7f46c](https://github.com/typewoo/sdk/commit/ed7f46c))
- wrap responses around `ApiResult<T>` ([75b0afb](https://github.com/typewoo/sdk/commit/75b0afb))
- add missing request options ([e83da78](https://github.com/typewoo/sdk/commit/e83da78))

### ❤️ Thank You

- Kostas Makris

## 0.0.14 (2025-07-27)

### 🩹 Fixes

- `tsup` config ([38d1e34](https://github.com/typewoo/sdk/commit/38d1e34))

### ❤️ Thank You

- Kostas Makris

## 0.0.13 (2025-07-27)

This was a version bump only, there were no code changes.

## 0.0.12 (2025-07-27)

This was a version bump only, there were no code changes.

## 0.0.11 (2025-07-27)

This was a version bump only, there were no code changes.

## 0.0.10 (2025-07-27)

### 🩹 Fixes

- disable workflow and test ([44bf0eb](https://github.com/typewoo/sdk/commit/44bf0eb))

### ❤️ Thank You

- Kostas Makris

## 0.0.9 (2025-07-27)

### 🩹 Fixes

- update `tsup` config ([3c60ab2](https://github.com/typewoo/sdk/commit/3c60ab2))

### ❤️ Thank You

- Kostas Makris

## 0.0.8 (2025-07-26)

### 🚀 Features

- initial unit testing ([cef82b7](https://github.com/typewoo/sdk/commit/cef82b7))

### 🩹 Fixes

- eslint errors ([107ac3a](https://github.com/typewoo/sdk/commit/107ac3a))
- sdk initialization ([2277aa8](https://github.com/typewoo/sdk/commit/2277aa8))

### ❤️ Thank You

- Kostas Makris

## 0.0.7 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.6 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.5 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.4 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.3 (2025-07-25)

This was a version bump only, there were no code changes.

## 0.0.2 (2025-07-25)

This was a version bump only, there were no code changes.

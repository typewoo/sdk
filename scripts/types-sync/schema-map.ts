/**
 * Schema-to-route registry. The single manual seam between our Zod schemas
 * and the WooCommerce REST routes they describe.
 *
 * One row per schema. The diff engine consumes this list directly — no
 * surface or kind special-casing lives outside this file.
 *
 * Adding a new resource: import the trio (response, request, query) and append
 * three rows. The registry-completeness test will fail CI if a newly exported
 * schema isn't mapped here.
 */

import type { ZodType } from 'zod';

import {
  AdminCouponSchema,
  AdminCouponCreateRequestSchema,
  AdminCouponUpdateRequestSchema,
  AdminCouponQueryParamsSchema,
  AdminCustomerSchema,
  AdminCustomerCreateRequestSchema,
  AdminCustomerUpdateRequestSchema,
  AdminCustomerQueryParamsSchema,
  AdminProductSchema,
  AdminProductCreateRequestSchema,
  AdminProductUpdateRequestSchema,
  AdminProductQueryParamsSchema,
  AdminProductReviewSchema,
  AdminProductReviewCreateRequestSchema,
  AdminProductReviewUpdateRequestSchema,
  AdminProductReviewQueryParamsSchema,
  AdminOrderSchema,
  AdminOrderCreateRequestSchema,
  AdminOrderUpdateRequestSchema,
  AdminOrderQueryParamsSchema,
  AdminOrderNoteSchema,
  AdminOrderNoteCreateRequestSchema,
  AdminRefundSchema,
  AdminRefundCreateRequestSchema,
  AdminRefundQueryParamsSchema,
  AdminTaxSchema,
  AdminTaxCreateRequestSchema,
  AdminTaxUpdateRequestSchema,
  AdminTaxQueryParamsSchema,
  AdminTaxClassSchema,
  AdminTaxClassCreateRequestSchema,
  AdminTaxClassQueryParamsSchema,
  AdminShippingZoneSchema,
  AdminShippingZoneCreateRequestSchema,
  AdminShippingZoneUpdateRequestSchema,
  AdminShippingZoneQueryParamsSchema,
  AdminShippingZoneMethodSchema,
  AdminShippingZoneMethodCreateRequestSchema,
  AdminShippingZoneMethodUpdateRequestSchema,
  AdminShippingZoneMethodQueryParamsSchema,
  AdminShippingMethodSchema,
  AdminShippingMethodQueryParamsSchema,
  AdminPaymentGatewaySchema,
  AdminPaymentGatewayUpdateRequestSchema,
  AdminPaymentGatewayQueryParamsSchema,
  AdminWebhookSchema,
  AdminWebhookCreateRequestSchema,
  AdminWebhookUpdateRequestSchema,
  AdminWebhookQueryParamsSchema,
  AdminSettingGroupSchema,
  AdminSettingSchema,
  AdminSettingUpdateRequestSchema,
  AdminTaxonomyCategorySchema,
  AdminTaxonomyCategoryCreateRequestSchema,
  AdminTaxonomyCategoryUpdateRequestSchema,
  AdminTaxonomyCategoryQueryParamsSchema,
  AdminTaxonomyTagSchema,
  AdminTaxonomyTagCreateRequestSchema,
  AdminTaxonomyTagUpdateRequestSchema,
  AdminTaxonomyTagQueryParamsSchema,
  AdminShippingClassSchema,
  AdminShippingClassCreateRequestSchema,
  AdminShippingClassUpdateRequestSchema,
  AdminShippingClassQueryParamsSchema,
  AdminBrandSchema,
  AdminBrandCreateRequestSchema,
  AdminBrandUpdateRequestSchema,
  AdminBrandQueryParamsSchema,
  AdminProductAttributeCreateRequestSchema,
  AdminProductAttributeUpdateRequestSchema,
  AdminProductAttributeQueryParamsSchema,
  AdminProductAttributeTermSchema,
  AdminProductAttributeTermCreateRequestSchema,
  AdminProductAttributeTermUpdateRequestSchema,
  AdminProductAttributeTermQueryParamsSchema,
  AdminProductAttributeEntitySchema,
} from '../../packages/core/src/lib/types/admin/index.js';

export type Surface = 'admin' | 'store' | 'analytics';
export type Kind = 'response' | 'request' | 'query';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface SchemaMapEntry {
  /** Symbol name of the Zod schema. Used in completeness tests + reports. */
  name: string;
  zod: ZodType;
  surface: Surface;
  /** Route as it appears in the WC discovery payload, e.g. `/wc/v3/coupons`. */
  route: string;
  kind: Kind;
  /** Required when kind is 'request' or 'query' to disambiguate args. */
  method?: HttpMethod;
  /**
   * Optional back-compat acks. Fields listed here are intentionally kept in
   * the SDK even though newer WC versions may have removed them, to avoid
   * breaking clients still running older WC. The reconciler downgrades any
   * drift on these fields to `info` until the deprecation falls outside the
   * support window — at which point it auto-promotes to `error` ("safe to
   * remove now").
   */
  deprecated?: {
    /** Dot-paths of fields kept for back-compat (e.g. ['legacy_total']). */
    fields: string[];
    /** WC version that removed the field (informational). */
    sinceVersion?: string;
    /** Why the SDK still carries it. */
    note?: string;
  };
}

/** Helper to keep rows tight. */
function trio(
  base: string,
  responseSchema: ZodType,
  responseName: string,
  requestSchema: ZodType,
  requestName: string,
  querySchema: ZodType,
  queryName: string,
  surface: Surface = 'admin'
): SchemaMapEntry[] {
  return [
    {
      name: responseName,
      zod: responseSchema,
      surface,
      route: base,
      kind: 'response',
    },
    {
      name: requestName,
      zod: requestSchema,
      surface,
      route: base,
      kind: 'request',
      method: 'POST',
    },
    {
      name: queryName,
      zod: querySchema,
      surface,
      route: base,
      kind: 'query',
      method: 'GET',
    },
  ];
}

/**
 * Like {@link trio} but emits separate POST and PUT request rows so each
 * upstream method can be diffed against its own SDK schema. Use when the
 * resource exposes both create and update endpoints with their own schemas.
 */
function quartet(
  base: string,
  responseSchema: ZodType,
  responseName: string,
  createRequestSchema: ZodType,
  createRequestName: string,
  updateRequestSchema: ZodType,
  updateRequestName: string,
  querySchema: ZodType,
  queryName: string,
  surface: Surface = 'admin'
): SchemaMapEntry[] {
  return [
    {
      name: responseName,
      zod: responseSchema,
      surface,
      route: base,
      kind: 'response',
    },
    {
      name: createRequestName,
      zod: createRequestSchema,
      surface,
      route: base,
      kind: 'request',
      method: 'POST',
    },
    {
      name: updateRequestName,
      zod: updateRequestSchema,
      surface,
      route: base,
      kind: 'request',
      method: 'PUT',
    },
    {
      name: queryName,
      zod: querySchema,
      surface,
      route: base,
      kind: 'query',
      method: 'GET',
    },
  ];
}

export const SCHEMA_MAP: SchemaMapEntry[] = [
  // ---------------- Admin (wc/v3) ----------------

  ...quartet(
    '/wc/v3/coupons',
    AdminCouponSchema,
    'AdminCouponSchema',
    AdminCouponCreateRequestSchema,
    'AdminCouponCreateRequestSchema',
    AdminCouponUpdateRequestSchema,
    'AdminCouponUpdateRequestSchema',
    AdminCouponQueryParamsSchema,
    'AdminCouponQueryParamsSchema'
  ),

  ...quartet(
    '/wc/v3/customers',
    AdminCustomerSchema,
    'AdminCustomerSchema',
    AdminCustomerCreateRequestSchema,
    'AdminCustomerCreateRequestSchema',
    AdminCustomerUpdateRequestSchema,
    'AdminCustomerUpdateRequestSchema',
    AdminCustomerQueryParamsSchema,
    'AdminCustomerQueryParamsSchema'
  ),

  ...quartet(
    '/wc/v3/products',
    AdminProductSchema,
    'AdminProductSchema',
    AdminProductCreateRequestSchema,
    'AdminProductCreateRequestSchema',
    AdminProductUpdateRequestSchema,
    'AdminProductUpdateRequestSchema',
    AdminProductQueryParamsSchema,
    'AdminProductQueryParamsSchema'
  ),

  ...quartet(
    '/wc/v3/products/reviews',
    AdminProductReviewSchema,
    'AdminProductReviewSchema',
    AdminProductReviewCreateRequestSchema,
    'AdminProductReviewCreateRequestSchema',
    AdminProductReviewUpdateRequestSchema,
    'AdminProductReviewUpdateRequestSchema',
    AdminProductReviewQueryParamsSchema,
    'AdminProductReviewQueryParamsSchema'
  ),

  ...quartet(
    '/wc/v3/orders',
    AdminOrderSchema,
    'AdminOrderSchema',
    AdminOrderCreateRequestSchema,
    'AdminOrderCreateRequestSchema',
    AdminOrderUpdateRequestSchema,
    'AdminOrderUpdateRequestSchema',
    AdminOrderQueryParamsSchema,
    'AdminOrderQueryParamsSchema'
  ),

  // Order notes — child route, no list query
  {
    name: 'AdminOrderNoteSchema',
    zod: AdminOrderNoteSchema,
    surface: 'admin',
    route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes',
    kind: 'response',
  },
  {
    name: 'AdminOrderNoteCreateRequestSchema',
    zod: AdminOrderNoteCreateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes',
    kind: 'request',
    method: 'POST',
  },

  // Refunds — child route under orders
  {
    name: 'AdminRefundSchema',
    zod: AdminRefundSchema,
    surface: 'admin',
    route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
    kind: 'response',
  },
  {
    name: 'AdminRefundCreateRequestSchema',
    zod: AdminRefundCreateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
    kind: 'request',
    method: 'POST',
  },
  {
    name: 'AdminRefundQueryParamsSchema',
    zod: AdminRefundQueryParamsSchema,
    surface: 'admin',
    route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds',
    kind: 'query',
    method: 'GET',
  },

  ...quartet(
    '/wc/v3/taxes',
    AdminTaxSchema,
    'AdminTaxSchema',
    AdminTaxCreateRequestSchema,
    'AdminTaxCreateRequestSchema',
    AdminTaxUpdateRequestSchema,
    'AdminTaxUpdateRequestSchema',
    AdminTaxQueryParamsSchema,
    'AdminTaxQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/taxes/classes',
    AdminTaxClassSchema,
    'AdminTaxClassSchema',
    AdminTaxClassCreateRequestSchema,
    'AdminTaxClassCreateRequestSchema',
    AdminTaxClassQueryParamsSchema,
    'AdminTaxClassQueryParamsSchema'
  ),

  ...quartet(
    '/wc/v3/shipping/zones',
    AdminShippingZoneSchema,
    'AdminShippingZoneSchema',
    AdminShippingZoneCreateRequestSchema,
    'AdminShippingZoneCreateRequestSchema',
    AdminShippingZoneUpdateRequestSchema,
    'AdminShippingZoneUpdateRequestSchema',
    AdminShippingZoneQueryParamsSchema,
    'AdminShippingZoneQueryParamsSchema'
  ),

  // Shipping zone methods — child route
  {
    name: 'AdminShippingZoneMethodSchema',
    zod: AdminShippingZoneMethodSchema,
    surface: 'admin',
    route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
    kind: 'response',
  },
  {
    name: 'AdminShippingZoneMethodCreateRequestSchema',
    zod: AdminShippingZoneMethodCreateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
    kind: 'request',
    method: 'POST',
  },
  {
    name: 'AdminShippingZoneMethodUpdateRequestSchema',
    zod: AdminShippingZoneMethodUpdateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
    kind: 'request',
    method: 'PUT',
  },
  {
    name: 'AdminShippingZoneMethodQueryParamsSchema',
    zod: AdminShippingZoneMethodQueryParamsSchema,
    surface: 'admin',
    route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods',
    kind: 'query',
    method: 'GET',
  },

  {
    name: 'AdminShippingMethodSchema',
    zod: AdminShippingMethodSchema,
    surface: 'admin',
    route: '/wc/v3/shipping_methods',
    kind: 'response',
  },
  {
    name: 'AdminShippingMethodQueryParamsSchema',
    zod: AdminShippingMethodQueryParamsSchema,
    surface: 'admin',
    route: '/wc/v3/shipping_methods',
    kind: 'query',
    method: 'GET',
  },

  // Payment gateways — PUT only upstream (registration is plugin-driven).
  {
    name: 'AdminPaymentGatewaySchema',
    zod: AdminPaymentGatewaySchema,
    surface: 'admin',
    route: '/wc/v3/payment_gateways',
    kind: 'response',
  },
  {
    name: 'AdminPaymentGatewayUpdateRequestSchema',
    zod: AdminPaymentGatewayUpdateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/payment_gateways',
    kind: 'request',
    method: 'PUT',
  },
  {
    name: 'AdminPaymentGatewayQueryParamsSchema',
    zod: AdminPaymentGatewayQueryParamsSchema,
    surface: 'admin',
    route: '/wc/v3/payment_gateways',
    kind: 'query',
    method: 'GET',
  },

  ...quartet(
    '/wc/v3/webhooks',
    AdminWebhookSchema,
    'AdminWebhookSchema',
    AdminWebhookCreateRequestSchema,
    'AdminWebhookCreateRequestSchema',
    AdminWebhookUpdateRequestSchema,
    'AdminWebhookUpdateRequestSchema',
    AdminWebhookQueryParamsSchema,
    'AdminWebhookQueryParamsSchema'
  ),

  // Settings — group + individual setting
  {
    name: 'AdminSettingGroupSchema',
    zod: AdminSettingGroupSchema,
    surface: 'admin',
    route: '/wc/v3/settings',
    kind: 'response',
  },
  {
    name: 'AdminSettingSchema',
    zod: AdminSettingSchema,
    surface: 'admin',
    route: '/wc/v3/settings/(?P<group_id>[\\w-]+)',
    kind: 'response',
  },
  {
    name: 'AdminSettingUpdateRequestSchema',
    zod: AdminSettingUpdateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/settings/(?P<group_id>[\\w-]+)/(?P<id>[\\w-]+)',
    kind: 'request',
    method: 'PUT',
  },

  // Categories / tags / shipping classes — taxonomy routes
  ...quartet(
    '/wc/v3/products/categories',
    AdminTaxonomyCategorySchema,
    'AdminTaxonomyCategorySchema',
    AdminTaxonomyCategoryCreateRequestSchema,
    'AdminTaxonomyCategoryCreateRequestSchema',
    AdminTaxonomyCategoryUpdateRequestSchema,
    'AdminTaxonomyCategoryUpdateRequestSchema',
    AdminTaxonomyCategoryQueryParamsSchema,
    'AdminTaxonomyCategoryQueryParamsSchema'
  ),
  ...quartet(
    '/wc/v3/products/tags',
    AdminTaxonomyTagSchema,
    'AdminTaxonomyTagSchema',
    AdminTaxonomyTagCreateRequestSchema,
    'AdminTaxonomyTagCreateRequestSchema',
    AdminTaxonomyTagUpdateRequestSchema,
    'AdminTaxonomyTagUpdateRequestSchema',
    AdminTaxonomyTagQueryParamsSchema,
    'AdminTaxonomyTagQueryParamsSchema'
  ),
  ...quartet(
    '/wc/v3/products/brands',
    AdminBrandSchema,
    'AdminBrandSchema',
    AdminBrandCreateRequestSchema,
    'AdminBrandCreateRequestSchema',
    AdminBrandUpdateRequestSchema,
    'AdminBrandUpdateRequestSchema',
    AdminBrandQueryParamsSchema,
    'AdminBrandQueryParamsSchema'
  ),
  ...quartet(
    '/wc/v3/products/shipping_classes',
    AdminShippingClassSchema,
    'AdminShippingClassSchema',
    AdminShippingClassCreateRequestSchema,
    'AdminShippingClassCreateRequestSchema',
    AdminShippingClassUpdateRequestSchema,
    'AdminShippingClassUpdateRequestSchema',
    AdminShippingClassQueryParamsSchema,
    'AdminShippingClassQueryParamsSchema'
  ),

  // Product attributes (and terms — child route)
  {
    name: 'AdminProductAttributeEntitySchema',
    zod: AdminProductAttributeEntitySchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes',
    kind: 'response',
  },
  {
    name: 'AdminProductAttributeCreateRequestSchema',
    zod: AdminProductAttributeCreateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes',
    kind: 'request',
    method: 'POST',
  },
  {
    name: 'AdminProductAttributeUpdateRequestSchema',
    zod: AdminProductAttributeUpdateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes',
    kind: 'request',
    method: 'PUT',
  },
  {
    name: 'AdminProductAttributeQueryParamsSchema',
    zod: AdminProductAttributeQueryParamsSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes',
    kind: 'query',
    method: 'GET',
  },
  {
    name: 'AdminProductAttributeTermSchema',
    zod: AdminProductAttributeTermSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
    kind: 'response',
  },
  {
    name: 'AdminProductAttributeTermCreateRequestSchema',
    zod: AdminProductAttributeTermCreateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
    kind: 'request',
    method: 'POST',
  },
  {
    name: 'AdminProductAttributeTermUpdateRequestSchema',
    zod: AdminProductAttributeTermUpdateRequestSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
    kind: 'request',
    method: 'PUT',
  },
  {
    name: 'AdminProductAttributeTermQueryParamsSchema',
    zod: AdminProductAttributeTermQueryParamsSchema,
    surface: 'admin',
    route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms',
    kind: 'query',
    method: 'GET',
  },

  // ---------------- Store (wc/store/v1) ----------------
  // TODO: populate from packages/core/src/lib/types/store/**. The store
  // schemas are split per-action (cart.item.add.request.ts etc.) — each
  // request/response file maps to a single (route, kind) pair. The completeness
  // test in __tests__/registry.spec.ts will fail CI when these are added to
  // the type tree without a corresponding row here.

  // ---------------- Analytics (wc-analytics) ----------------
  // TODO: populate from packages/core/src/lib/types/analytics/**.
];

export function findEntries(zod: ZodType): SchemaMapEntry[] {
  return SCHEMA_MAP.filter((e) => e.zod === zod);
}

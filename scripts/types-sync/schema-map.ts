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
  AdminCouponRequestSchema,
  AdminCouponQueryParamsSchema,
  AdminCustomerSchema,
  AdminCustomerRequestSchema,
  AdminCustomerQueryParamsSchema,
  AdminProductSchema,
  AdminProductRequestSchema,
  AdminProductQueryParamsSchema,
  AdminProductReviewSchema,
  AdminProductReviewRequestSchema,
  AdminProductReviewQueryParamsSchema,
  AdminOrderSchema,
  AdminOrderRequestSchema,
  AdminOrderQueryParamsSchema,
  AdminOrderNoteSchema,
  AdminOrderNoteRequestSchema,
  AdminRefundSchema,
  AdminRefundCreateRequestSchema,
  AdminRefundQueryParamsSchema,
  AdminTaxSchema,
  AdminTaxRequestSchema,
  AdminTaxQueryParamsSchema,
  AdminTaxClassSchema,
  AdminTaxClassRequestSchema,
  AdminTaxClassQueryParamsSchema,
  AdminShippingZoneSchema,
  AdminShippingZoneRequestSchema,
  AdminShippingZoneQueryParamsSchema,
  AdminShippingZoneMethodSchema,
  AdminShippingZoneMethodRequestSchema,
  AdminShippingZoneMethodQueryParamsSchema,
  AdminShippingMethodSchema,
  AdminShippingMethodQueryParamsSchema,
  AdminPaymentGatewaySchema,
  AdminPaymentGatewayRequestSchema,
  AdminPaymentGatewayQueryParamsSchema,
  AdminWebhookSchema,
  AdminWebhookRequestSchema,
  AdminWebhookQueryParamsSchema,
  AdminSettingGroupSchema,
  AdminSettingSchema,
  AdminSettingRequestSchema,
  AdminTaxonomyCategorySchema,
  AdminTaxonomyCategoryRequestSchema,
  AdminTaxonomyCategoryQueryParamsSchema,
  AdminTaxonomyTagSchema,
  AdminTaxonomyTagRequestSchema,
  AdminTaxonomyTagQueryParamsSchema,
  AdminShippingClassSchema,
  AdminShippingClassRequestSchema,
  AdminShippingClassQueryParamsSchema,
  AdminProductAttributeRequestSchema,
  AdminProductAttributeQueryParamsSchema,
  AdminProductAttributeTermSchema,
  AdminProductAttributeTermRequestSchema,
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
    { name: responseName, zod: responseSchema, surface, route: base, kind: 'response' },
    { name: requestName, zod: requestSchema, surface, route: base, kind: 'request', method: 'POST' },
    { name: queryName, zod: querySchema, surface, route: base, kind: 'query', method: 'GET' },
  ];
}

export const SCHEMA_MAP: SchemaMapEntry[] = [
  // ---------------- Admin (wc/v3) ----------------

  ...trio(
    '/wc/v3/coupons',
    AdminCouponSchema, 'AdminCouponSchema',
    AdminCouponRequestSchema, 'AdminCouponRequestSchema',
    AdminCouponQueryParamsSchema, 'AdminCouponQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/customers',
    AdminCustomerSchema, 'AdminCustomerSchema',
    AdminCustomerRequestSchema, 'AdminCustomerRequestSchema',
    AdminCustomerQueryParamsSchema, 'AdminCustomerQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/products',
    AdminProductSchema, 'AdminProductSchema',
    AdminProductRequestSchema, 'AdminProductRequestSchema',
    AdminProductQueryParamsSchema, 'AdminProductQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/products/reviews',
    AdminProductReviewSchema, 'AdminProductReviewSchema',
    AdminProductReviewRequestSchema, 'AdminProductReviewRequestSchema',
    AdminProductReviewQueryParamsSchema, 'AdminProductReviewQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/orders',
    AdminOrderSchema, 'AdminOrderSchema',
    AdminOrderRequestSchema, 'AdminOrderRequestSchema',
    AdminOrderQueryParamsSchema, 'AdminOrderQueryParamsSchema'
  ),

  // Order notes — child route, no list query
  { name: 'AdminOrderNoteSchema', zod: AdminOrderNoteSchema, surface: 'admin', route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes', kind: 'response' },
  { name: 'AdminOrderNoteRequestSchema', zod: AdminOrderNoteRequestSchema, surface: 'admin', route: '/wc/v3/orders/(?P<order_id>[\\d]+)/notes', kind: 'request', method: 'POST' },

  // Refunds — child route under orders
  { name: 'AdminRefundSchema', zod: AdminRefundSchema, surface: 'admin', route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds', kind: 'response' },
  { name: 'AdminRefundCreateRequestSchema', zod: AdminRefundCreateRequestSchema, surface: 'admin', route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds', kind: 'request', method: 'POST' },
  { name: 'AdminRefundQueryParamsSchema', zod: AdminRefundQueryParamsSchema, surface: 'admin', route: '/wc/v3/orders/(?P<order_id>[\\d]+)/refunds', kind: 'query', method: 'GET' },

  ...trio(
    '/wc/v3/taxes',
    AdminTaxSchema, 'AdminTaxSchema',
    AdminTaxRequestSchema, 'AdminTaxRequestSchema',
    AdminTaxQueryParamsSchema, 'AdminTaxQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/taxes/classes',
    AdminTaxClassSchema, 'AdminTaxClassSchema',
    AdminTaxClassRequestSchema, 'AdminTaxClassRequestSchema',
    AdminTaxClassQueryParamsSchema, 'AdminTaxClassQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/shipping/zones',
    AdminShippingZoneSchema, 'AdminShippingZoneSchema',
    AdminShippingZoneRequestSchema, 'AdminShippingZoneRequestSchema',
    AdminShippingZoneQueryParamsSchema, 'AdminShippingZoneQueryParamsSchema'
  ),

  // Shipping zone methods — child route
  { name: 'AdminShippingZoneMethodSchema', zod: AdminShippingZoneMethodSchema, surface: 'admin', route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods', kind: 'response' },
  { name: 'AdminShippingZoneMethodRequestSchema', zod: AdminShippingZoneMethodRequestSchema, surface: 'admin', route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods', kind: 'request', method: 'POST' },
  { name: 'AdminShippingZoneMethodQueryParamsSchema', zod: AdminShippingZoneMethodQueryParamsSchema, surface: 'admin', route: '/wc/v3/shipping/zones/(?P<zone_id>[\\d]+)/methods', kind: 'query', method: 'GET' },

  { name: 'AdminShippingMethodSchema', zod: AdminShippingMethodSchema, surface: 'admin', route: '/wc/v3/shipping_methods', kind: 'response' },
  { name: 'AdminShippingMethodQueryParamsSchema', zod: AdminShippingMethodQueryParamsSchema, surface: 'admin', route: '/wc/v3/shipping_methods', kind: 'query', method: 'GET' },

  ...trio(
    '/wc/v3/payment_gateways',
    AdminPaymentGatewaySchema, 'AdminPaymentGatewaySchema',
    AdminPaymentGatewayRequestSchema, 'AdminPaymentGatewayRequestSchema',
    AdminPaymentGatewayQueryParamsSchema, 'AdminPaymentGatewayQueryParamsSchema'
  ),

  ...trio(
    '/wc/v3/webhooks',
    AdminWebhookSchema, 'AdminWebhookSchema',
    AdminWebhookRequestSchema, 'AdminWebhookRequestSchema',
    AdminWebhookQueryParamsSchema, 'AdminWebhookQueryParamsSchema'
  ),

  // Settings — group + individual setting
  { name: 'AdminSettingGroupSchema', zod: AdminSettingGroupSchema, surface: 'admin', route: '/wc/v3/settings', kind: 'response' },
  { name: 'AdminSettingSchema', zod: AdminSettingSchema, surface: 'admin', route: '/wc/v3/settings/(?P<group_id>[\\w-]+)', kind: 'response' },
  { name: 'AdminSettingRequestSchema', zod: AdminSettingRequestSchema, surface: 'admin', route: '/wc/v3/settings/(?P<group_id>[\\w-]+)/(?P<id>[\\w-]+)', kind: 'request', method: 'PUT' },

  // Categories / tags / shipping classes — taxonomy routes
  ...trio(
    '/wc/v3/products/categories',
    AdminTaxonomyCategorySchema, 'AdminTaxonomyCategorySchema',
    AdminTaxonomyCategoryRequestSchema, 'AdminTaxonomyCategoryRequestSchema',
    AdminTaxonomyCategoryQueryParamsSchema, 'AdminTaxonomyCategoryQueryParamsSchema'
  ),
  ...trio(
    '/wc/v3/products/tags',
    AdminTaxonomyTagSchema, 'AdminTaxonomyTagSchema',
    AdminTaxonomyTagRequestSchema, 'AdminTaxonomyTagRequestSchema',
    AdminTaxonomyTagQueryParamsSchema, 'AdminTaxonomyTagQueryParamsSchema'
  ),
  ...trio(
    '/wc/v3/products/shipping_classes',
    AdminShippingClassSchema, 'AdminShippingClassSchema',
    AdminShippingClassRequestSchema, 'AdminShippingClassRequestSchema',
    AdminShippingClassQueryParamsSchema, 'AdminShippingClassQueryParamsSchema'
  ),

  // Product attributes (and terms — child route)
  { name: 'AdminProductAttributeEntitySchema', zod: AdminProductAttributeEntitySchema, surface: 'admin', route: '/wc/v3/products/attributes', kind: 'response' },
  { name: 'AdminProductAttributeRequestSchema', zod: AdminProductAttributeRequestSchema, surface: 'admin', route: '/wc/v3/products/attributes', kind: 'request', method: 'POST' },
  { name: 'AdminProductAttributeQueryParamsSchema', zod: AdminProductAttributeQueryParamsSchema, surface: 'admin', route: '/wc/v3/products/attributes', kind: 'query', method: 'GET' },
  { name: 'AdminProductAttributeTermSchema', zod: AdminProductAttributeTermSchema, surface: 'admin', route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms', kind: 'response' },
  { name: 'AdminProductAttributeTermRequestSchema', zod: AdminProductAttributeTermRequestSchema, surface: 'admin', route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms', kind: 'request', method: 'POST' },
  { name: 'AdminProductAttributeTermQueryParamsSchema', zod: AdminProductAttributeTermQueryParamsSchema, surface: 'admin', route: '/wc/v3/products/attributes/(?P<attribute_id>[\\d]+)/terms', kind: 'query', method: 'GET' },

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

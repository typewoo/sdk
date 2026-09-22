/**
 * Aliases for request types that 4.0 split into `*CreateRequest` /
 * `*UpdateRequest`. The 3.x types had all-optional fields, so each alias
 * points at the update variant (or the only variant that exists).
 * Remove in 5.0.
 */
import {
  AdminBrandUpdateRequestSchema,
  type AdminBrandUpdateRequest,
} from './product-brands/brand.update.schema.js';
import {
  AdminCouponUpdateRequestSchema,
  type AdminCouponUpdateRequest,
} from './coupons/coupon.update.schema.js';
import {
  AdminCustomerUpdateRequestSchema,
  type AdminCustomerUpdateRequest,
} from './customers/customer.update.schema.js';
import {
  AdminOrderUpdateRequestSchema,
  type AdminOrderUpdateRequest,
} from './orders/order.update.schema.js';
import {
  AdminOrderNoteCreateRequestSchema,
  type AdminOrderNoteCreateRequest,
} from './orders/order-note.schema.js';
import {
  AdminPaymentGatewayUpdateRequestSchema,
  type AdminPaymentGatewayUpdateRequest,
} from './payment-gateways/payment-gateway.update.schema.js';
import {
  AdminProductAttributeUpdateRequestSchema,
  type AdminProductAttributeUpdateRequest,
} from './attributes/attribute.update.schema.js';
import {
  AdminProductAttributeTermUpdateRequestSchema,
  type AdminProductAttributeTermUpdateRequest,
} from './attributes/attribute-term.update.schema.js';
import {
  AdminProductUpdateRequestSchema,
  type AdminProductUpdateRequest,
} from './products/product.update.schema.js';
import {
  AdminProductReviewUpdateRequestSchema,
  type AdminProductReviewUpdateRequest,
} from './product-reviews/product-review.update.schema.js';
import {
  AdminSettingUpdateRequestSchema,
  type AdminSettingUpdateRequest,
} from './settings/setting.update.schema.js';
import {
  AdminShippingClassUpdateRequestSchema,
  type AdminShippingClassUpdateRequest,
} from './shipping-classes/shipping-class.update.schema.js';
import {
  AdminShippingZoneUpdateRequestSchema,
  type AdminShippingZoneUpdateRequest,
} from './shipping-zones/shipping-zone.update.schema.js';
import {
  AdminShippingZoneMethodUpdateRequestSchema,
  type AdminShippingZoneMethodUpdateRequest,
} from './shipping-zones/shipping-zone-method.update.schema.js';
import {
  AdminTaxUpdateRequestSchema,
  type AdminTaxUpdateRequest,
} from './taxes/tax.update.schema.js';
import {
  AdminTaxClassCreateRequestSchema,
  type AdminTaxClassCreateRequest,
} from './taxes/tax-class.create.schema.js';
import {
  AdminTaxonomyCategoryUpdateRequestSchema,
  type AdminTaxonomyCategoryUpdateRequest,
} from './product-categories/product-category.update.schema.js';
import {
  AdminTaxonomyTagUpdateRequestSchema,
  type AdminTaxonomyTagUpdateRequest,
} from './product-tags/product-tag.update.schema.js';
import {
  AdminWebhookUpdateRequestSchema,
  type AdminWebhookUpdateRequest,
} from './webhooks/webhook.update.schema.js';

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminBrandCreateRequest` for create() and `AdminBrandUpdateRequest` for update() instead. */
export const AdminBrandRequestSchema = AdminBrandUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminBrandCreateRequest` for create() and `AdminBrandUpdateRequest` for update() instead. */
export type AdminBrandRequest = AdminBrandUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminCouponCreateRequest` for create() and `AdminCouponUpdateRequest` for update() instead. */
export const AdminCouponRequestSchema = AdminCouponUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminCouponCreateRequest` for create() and `AdminCouponUpdateRequest` for update() instead. */
export type AdminCouponRequest = AdminCouponUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminCustomerCreateRequest` for create() and `AdminCustomerUpdateRequest` for update() instead. */
export const AdminCustomerRequestSchema = AdminCustomerUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminCustomerCreateRequest` for create() and `AdminCustomerUpdateRequest` for update() instead. */
export type AdminCustomerRequest = AdminCustomerUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminOrderCreateRequest` for create() and `AdminOrderUpdateRequest` for update() instead. */
export const AdminOrderRequestSchema = AdminOrderUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminOrderCreateRequest` for create() and `AdminOrderUpdateRequest` for update() instead. */
export type AdminOrderRequest = AdminOrderUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminOrderNoteCreateRequest` instead. */
export const AdminOrderNoteRequestSchema = AdminOrderNoteCreateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminOrderNoteCreateRequest` instead. */
export type AdminOrderNoteRequest = AdminOrderNoteCreateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminPaymentGatewayCreateRequest` for create() and `AdminPaymentGatewayUpdateRequest` for update() instead. */
export const AdminPaymentGatewayRequestSchema =
  AdminPaymentGatewayUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminPaymentGatewayCreateRequest` for create() and `AdminPaymentGatewayUpdateRequest` for update() instead. */
export type AdminPaymentGatewayRequest = AdminPaymentGatewayUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductAttributeCreateRequest` for create() and `AdminProductAttributeUpdateRequest` for update() instead. */
export const AdminProductAttributeRequestSchema =
  AdminProductAttributeUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductAttributeCreateRequest` for create() and `AdminProductAttributeUpdateRequest` for update() instead. */
export type AdminProductAttributeRequest = AdminProductAttributeUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductAttributeTermCreateRequest` for create() and `AdminProductAttributeTermUpdateRequest` for update() instead. */
export const AdminProductAttributeTermRequestSchema =
  AdminProductAttributeTermUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductAttributeTermCreateRequest` for create() and `AdminProductAttributeTermUpdateRequest` for update() instead. */
export type AdminProductAttributeTermRequest =
  AdminProductAttributeTermUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductCreateRequest` for create() and `AdminProductUpdateRequest` for update() instead. */
export const AdminProductRequestSchema = AdminProductUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductCreateRequest` for create() and `AdminProductUpdateRequest` for update() instead. */
export type AdminProductRequest = AdminProductUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductReviewCreateRequest` for create() and `AdminProductReviewUpdateRequest` for update() instead. */
export const AdminProductReviewRequestSchema =
  AdminProductReviewUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminProductReviewCreateRequest` for create() and `AdminProductReviewUpdateRequest` for update() instead. */
export type AdminProductReviewRequest = AdminProductReviewUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminSettingCreateRequest` for create() and `AdminSettingUpdateRequest` for update() instead. */
export const AdminSettingRequestSchema = AdminSettingUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminSettingCreateRequest` for create() and `AdminSettingUpdateRequest` for update() instead. */
export type AdminSettingRequest = AdminSettingUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminShippingClassCreateRequest` for create() and `AdminShippingClassUpdateRequest` for update() instead. */
export const AdminShippingClassRequestSchema =
  AdminShippingClassUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminShippingClassCreateRequest` for create() and `AdminShippingClassUpdateRequest` for update() instead. */
export type AdminShippingClassRequest = AdminShippingClassUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminShippingZoneCreateRequest` for create() and `AdminShippingZoneUpdateRequest` for update() instead. */
export const AdminShippingZoneRequestSchema =
  AdminShippingZoneUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminShippingZoneCreateRequest` for create() and `AdminShippingZoneUpdateRequest` for update() instead. */
export type AdminShippingZoneRequest = AdminShippingZoneUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminShippingZoneMethodCreateRequest` for create() and `AdminShippingZoneMethodUpdateRequest` for update() instead. */
export const AdminShippingZoneMethodRequestSchema =
  AdminShippingZoneMethodUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminShippingZoneMethodCreateRequest` for create() and `AdminShippingZoneMethodUpdateRequest` for update() instead. */
export type AdminShippingZoneMethodRequest =
  AdminShippingZoneMethodUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxCreateRequest` for create() and `AdminTaxUpdateRequest` for update() instead. */
export const AdminTaxRequestSchema = AdminTaxUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxCreateRequest` for create() and `AdminTaxUpdateRequest` for update() instead. */
export type AdminTaxRequest = AdminTaxUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxClassCreateRequest` instead. */
export const AdminTaxClassRequestSchema = AdminTaxClassCreateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxClassCreateRequest` instead. */
export type AdminTaxClassRequest = AdminTaxClassCreateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxonomyCategoryCreateRequest` for create() and `AdminTaxonomyCategoryUpdateRequest` for update() instead. */
export const AdminTaxonomyCategoryRequestSchema =
  AdminTaxonomyCategoryUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxonomyCategoryCreateRequest` for create() and `AdminTaxonomyCategoryUpdateRequest` for update() instead. */
export type AdminTaxonomyCategoryRequest = AdminTaxonomyCategoryUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxonomyTagCreateRequest` for create() and `AdminTaxonomyTagUpdateRequest` for update() instead. */
export const AdminTaxonomyTagRequestSchema =
  AdminTaxonomyTagUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminTaxonomyTagCreateRequest` for create() and `AdminTaxonomyTagUpdateRequest` for update() instead. */
export type AdminTaxonomyTagRequest = AdminTaxonomyTagUpdateRequest;

/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminWebhookCreateRequest` for create() and `AdminWebhookUpdateRequest` for update() instead. */
export const AdminWebhookRequestSchema = AdminWebhookUpdateRequestSchema;
/** @deprecated Deprecated in 4.0 and will be removed in 5.0. Use `AdminWebhookCreateRequest` for create() and `AdminWebhookUpdateRequest` for update() instead. */
export type AdminWebhookRequest = AdminWebhookUpdateRequest;

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

/** @deprecated Removed in 4.0. Use `AdminBrandCreateRequest` for create() and `AdminBrandUpdateRequest` for update(). */
export const AdminBrandRequestSchema = AdminBrandUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminBrandCreateRequest` for create() and `AdminBrandUpdateRequest` for update(). */
export type AdminBrandRequest = AdminBrandUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminCouponCreateRequest` for create() and `AdminCouponUpdateRequest` for update(). */
export const AdminCouponRequestSchema = AdminCouponUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminCouponCreateRequest` for create() and `AdminCouponUpdateRequest` for update(). */
export type AdminCouponRequest = AdminCouponUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminCustomerCreateRequest` for create() and `AdminCustomerUpdateRequest` for update(). */
export const AdminCustomerRequestSchema = AdminCustomerUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminCustomerCreateRequest` for create() and `AdminCustomerUpdateRequest` for update(). */
export type AdminCustomerRequest = AdminCustomerUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminOrderCreateRequest` for create() and `AdminOrderUpdateRequest` for update(). */
export const AdminOrderRequestSchema = AdminOrderUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminOrderCreateRequest` for create() and `AdminOrderUpdateRequest` for update(). */
export type AdminOrderRequest = AdminOrderUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminOrderNoteCreateRequest`. */
export const AdminOrderNoteRequestSchema = AdminOrderNoteCreateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminOrderNoteCreateRequest`. */
export type AdminOrderNoteRequest = AdminOrderNoteCreateRequest;

/** @deprecated Removed in 4.0. Use `AdminPaymentGatewayCreateRequest` for create() and `AdminPaymentGatewayUpdateRequest` for update(). */
export const AdminPaymentGatewayRequestSchema =
  AdminPaymentGatewayUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminPaymentGatewayCreateRequest` for create() and `AdminPaymentGatewayUpdateRequest` for update(). */
export type AdminPaymentGatewayRequest = AdminPaymentGatewayUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminProductAttributeCreateRequest` for create() and `AdminProductAttributeUpdateRequest` for update(). */
export const AdminProductAttributeRequestSchema =
  AdminProductAttributeUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminProductAttributeCreateRequest` for create() and `AdminProductAttributeUpdateRequest` for update(). */
export type AdminProductAttributeRequest = AdminProductAttributeUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminProductAttributeTermCreateRequest` for create() and `AdminProductAttributeTermUpdateRequest` for update(). */
export const AdminProductAttributeTermRequestSchema =
  AdminProductAttributeTermUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminProductAttributeTermCreateRequest` for create() and `AdminProductAttributeTermUpdateRequest` for update(). */
export type AdminProductAttributeTermRequest =
  AdminProductAttributeTermUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminProductCreateRequest` for create() and `AdminProductUpdateRequest` for update(). */
export const AdminProductRequestSchema = AdminProductUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminProductCreateRequest` for create() and `AdminProductUpdateRequest` for update(). */
export type AdminProductRequest = AdminProductUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminProductReviewCreateRequest` for create() and `AdminProductReviewUpdateRequest` for update(). */
export const AdminProductReviewRequestSchema =
  AdminProductReviewUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminProductReviewCreateRequest` for create() and `AdminProductReviewUpdateRequest` for update(). */
export type AdminProductReviewRequest = AdminProductReviewUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminSettingCreateRequest` for create() and `AdminSettingUpdateRequest` for update(). */
export const AdminSettingRequestSchema = AdminSettingUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminSettingCreateRequest` for create() and `AdminSettingUpdateRequest` for update(). */
export type AdminSettingRequest = AdminSettingUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminShippingClassCreateRequest` for create() and `AdminShippingClassUpdateRequest` for update(). */
export const AdminShippingClassRequestSchema =
  AdminShippingClassUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminShippingClassCreateRequest` for create() and `AdminShippingClassUpdateRequest` for update(). */
export type AdminShippingClassRequest = AdminShippingClassUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminShippingZoneCreateRequest` for create() and `AdminShippingZoneUpdateRequest` for update(). */
export const AdminShippingZoneRequestSchema =
  AdminShippingZoneUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminShippingZoneCreateRequest` for create() and `AdminShippingZoneUpdateRequest` for update(). */
export type AdminShippingZoneRequest = AdminShippingZoneUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminShippingZoneMethodCreateRequest` for create() and `AdminShippingZoneMethodUpdateRequest` for update(). */
export const AdminShippingZoneMethodRequestSchema =
  AdminShippingZoneMethodUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminShippingZoneMethodCreateRequest` for create() and `AdminShippingZoneMethodUpdateRequest` for update(). */
export type AdminShippingZoneMethodRequest =
  AdminShippingZoneMethodUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminTaxCreateRequest` for create() and `AdminTaxUpdateRequest` for update(). */
export const AdminTaxRequestSchema = AdminTaxUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminTaxCreateRequest` for create() and `AdminTaxUpdateRequest` for update(). */
export type AdminTaxRequest = AdminTaxUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminTaxClassCreateRequest`. */
export const AdminTaxClassRequestSchema = AdminTaxClassCreateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminTaxClassCreateRequest`. */
export type AdminTaxClassRequest = AdminTaxClassCreateRequest;

/** @deprecated Removed in 4.0. Use `AdminTaxonomyCategoryCreateRequest` for create() and `AdminTaxonomyCategoryUpdateRequest` for update(). */
export const AdminTaxonomyCategoryRequestSchema =
  AdminTaxonomyCategoryUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminTaxonomyCategoryCreateRequest` for create() and `AdminTaxonomyCategoryUpdateRequest` for update(). */
export type AdminTaxonomyCategoryRequest = AdminTaxonomyCategoryUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminTaxonomyTagCreateRequest` for create() and `AdminTaxonomyTagUpdateRequest` for update(). */
export const AdminTaxonomyTagRequestSchema =
  AdminTaxonomyTagUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminTaxonomyTagCreateRequest` for create() and `AdminTaxonomyTagUpdateRequest` for update(). */
export type AdminTaxonomyTagRequest = AdminTaxonomyTagUpdateRequest;

/** @deprecated Removed in 4.0. Use `AdminWebhookCreateRequest` for create() and `AdminWebhookUpdateRequest` for update(). */
export const AdminWebhookRequestSchema = AdminWebhookUpdateRequestSchema;
/** @deprecated Removed in 4.0. Use `AdminWebhookCreateRequest` for create() and `AdminWebhookUpdateRequest` for update(). */
export type AdminWebhookRequest = AdminWebhookUpdateRequest;

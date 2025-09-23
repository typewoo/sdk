/**
 * Export all REST API types
 */
export * from './common.types.js';
export * from './product.types.js';
export * from './order.types.js';
export * from './customer.types.js';
export * from './coupon.types.js';
export * from './product-brand.types.js';
export * from './product-review.types.js';
export * from './refund.types.js';
export * from './tax.types.js';
export * from './webhook.types.js';
export * from './setting.types.js';
export * from './report.types.js';
export * from './shipping-zone.types.js';
export * from './payment-gateway.types.js';
export * from './shipping-method.types.js';
export * from './system-status.types.js';
export * from './data.types.js';

// Export taxonomy types with different names to avoid conflicts
export type {
  WcAdminProductCategory,
  WcAdminProductCategoryRequest,
  WcAdminProductCategoryQueryParams,
  WcAdminProductTag,
  WcAdminProductTagRequest,
  WcAdminProductTagQueryParams,
  WcAdminShippingClass,
  WcAdminShippingClassRequest,
  WcAdminShippingClassQueryParams,
} from './taxonomy.types.js';

// Export attribute types with different names to avoid conflicts
export type {
  WcAdminProductAttribute,
  WcAdminProductAttributeRequest,
  WcAdminProductAttributeQueryParams,
  WcAdminProductAttributeTerm,
  WcAdminProductAttributeTermRequest,
  WcAdminProductAttributeTermQueryParams,
} from './attribute.types.js';

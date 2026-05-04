/**
 * Export all REST API types with selective exports to avoid conflicts
 */
export * from './common.types.js';
export * from './products/index.js';
export * from './orders/index.js';
export * from './customers/index.js';
export * from './coupons/index.js';
export * from './product-reviews/index.js';
export * from './refunds/index.js';
export * from './taxes/index.js';
export * from './webhooks/index.js';
export * from './settings/index.js';
export * from './reports/index.js';
export * from './shipping-zones/index.js';
export * from './payment-gateways/index.js';
export * from './shipping-methods/index.js';
export * from './system-status/index.js';
export * from './data/index.js';
export * from './product-categories/index.js';
export * from './product-tags/index.js';
export * from './shipping-classes/index.js';
export * from './product-brands/index.js';

export {
  AdminProductAttributeSchema as AdminProductAttributeEntitySchema,
  AdminProductAttributeCreateRequestSchema,
  AdminProductAttributeUpdateRequestSchema,
  AdminProductAttributeQueryParamsSchema,
  AdminProductAttributeTermSchema,
  AdminProductAttributeTermCreateRequestSchema,
  AdminProductAttributeTermUpdateRequestSchema,
  AdminProductAttributeTermQueryParamsSchema,
} from './attributes/index.js';

export type {
  AdminProductAttributeCreateRequest,
  AdminProductAttributeUpdateRequest,
  AdminProductAttributeQueryParams,
  AdminProductAttributeTerm,
  AdminProductAttributeTermCreateRequest,
  AdminProductAttributeTermUpdateRequest,
  AdminProductAttributeTermQueryParams,
} from './attributes/index.js';

import { schemaRegistry } from '../../schema-registry.js';
import { AdminCouponSchema } from './coupon.schema.js';
import {
  AdminCouponBatchRequestSchema,
  AdminCouponBatchResponseSchema,
} from './coupon.batch.schema.js';
import { AdminCouponCreateRequestSchema } from './coupon.create.schema.js';
import { AdminCouponUpdateRequestSchema } from './coupon.update.schema.js';
import { AdminCouponQueryParamsSchema } from './coupon.query.schema.js';

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
schemaRegistry.add(AdminCouponCreateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/coupons',
  kind: 'request',
  method: 'POST',
});
schemaRegistry.add(AdminCouponUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/coupons/(?P<id>[\\d]+)',
  kind: 'request',
  method: 'PATCH',
});
schemaRegistry.add(AdminCouponQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/coupons',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminCouponBatchResponseSchema, {
  surface: 'admin',
  route: '/wc/v3/coupons/batch',
  kind: 'response',
});
// Note: WC batch endpoints expose the item schema (PATCH) in OPTIONS, not the
// {create, update, delete} envelope. AdminCouponBatchRequestSchema is correct
// for the actual API call but has no matching upstream schema to diff against,
// so we don't register it here to avoid false-positive drift errors.

export * from './coupon.schema.js';
export * from './coupon.batch.schema.js';
export * from './coupon.create.schema.js';
export * from './coupon.update.schema.js';
export * from './coupon.query.schema.js';

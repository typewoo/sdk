import { z } from 'zod';

import { AdminCouponCreateRequestSchema } from './coupon.create.schema.js';
import { AdminCouponUpdateRequestSchema } from './coupon.update.schema.js';

/**
 * Request body for POST /wc/v3/coupons/batch
 */
export const AdminCouponBatchRequestSchema = z.looseObject({
  create: z
    .array(AdminCouponCreateRequestSchema)
    .optional()
    .describe('List of coupons to create.'),
  update: z
    .array(AdminCouponUpdateRequestSchema)
    .optional()
    .describe('List of coupons to update.'),
  delete: z
    .array(z.number())
    .optional()
    .describe('List of coupon IDs to delete.'),
});

export type AdminCouponBatchRequest = z.input<
  typeof AdminCouponBatchRequestSchema
>;

/**
 * Response body for POST /wc/v3/coupons/batch
 */
export const AdminCouponBatchResponseSchema = z.looseObject({
  create: z
    .array(z.looseObject({}))
    .optional()
    .describe('List of created resources.'),
  update: z
    .array(z.looseObject({}))
    .optional()
    .describe('List of updated resources.'),
  delete: z
    .array(z.looseObject({}))
    .optional()
    .describe('List of delete resources.'),
});

export type AdminCouponBatchResponse = z.infer<
  typeof AdminCouponBatchResponseSchema
>;

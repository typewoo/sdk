import { z } from 'zod';

/**
 * Coupon stats totals/subtotals shape
 */
export const AnalyticsCouponStatsSchema = z.object({
  amount: z.number(),
  coupons_count: z.number(),
  orders_count: z.number(),
});
export type AnalyticsCouponStats = z.infer<typeof AnalyticsCouponStatsSchema>;

export const AnalyticsCouponIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsCouponStatsSchema,
});
export type AnalyticsCouponInterval = z.infer<
  typeof AnalyticsCouponIntervalSchema
>;

/**
 * Extended info for a coupon detail row
 */
export const AnalyticsCouponExtendedInfoSchema = z.object({
  code: z.string().optional(),
  date_created: z.string().optional(),
  date_created_gmt: z.string().optional(),
  date_expires: z.string().optional(),
  date_expires_gmt: z.string().optional(),
  discount_type: z.string().optional(),
});
export type AnalyticsCouponExtendedInfo = z.infer<
  typeof AnalyticsCouponExtendedInfoSchema
>;

/**
 * Single coupon row from the coupons detail endpoint
 */
export const AnalyticsCouponSchema = z.looseObject({
  coupon_id: z.number().describe('Coupon ID.'),
  amount: z.number().describe('Net discount amount.'),
  orders_count: z.number().describe('Number of orders.'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsCoupon = z.infer<typeof AnalyticsCouponSchema>;

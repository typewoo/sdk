import { z } from 'zod';
import {
  analyticsStatsIntervalSchema,
  analyticsStatsSegmentSchema,
} from '../stats.shared.js';

const couponStatsFields = {
  amount: z.number().describe('Net discount amount.'),
  coupons_count: z.number().describe('Number of coupons.'),
  orders_count: z.number().describe('Number of discounted orders.'),
};

/**
 * A single coupon stats segment
 */
export const AnalyticsCouponSegmentSchema = analyticsStatsSegmentSchema(
  z.looseObject(couponStatsFields)
);
export type AnalyticsCouponSegment = z.infer<
  typeof AnalyticsCouponSegmentSchema
>;

/**
 * Coupon stats totals/subtotals shape
 */
export const AnalyticsCouponStatsSchema = z.looseObject({
  ...couponStatsFields,
  segments: z
    .array(AnalyticsCouponSegmentSchema)
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsCouponStats = z.infer<typeof AnalyticsCouponStatsSchema>;

export const AnalyticsCouponIntervalSchema = analyticsStatsIntervalSchema(
  AnalyticsCouponStatsSchema
);
export type AnalyticsCouponInterval = z.infer<
  typeof AnalyticsCouponIntervalSchema
>;

export const AnalyticsCouponsStatsResponseSchema = z.looseObject({
  totals: AnalyticsCouponStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsCouponIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsCouponsStatsResponse = z.infer<
  typeof AnalyticsCouponsStatsResponseSchema
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

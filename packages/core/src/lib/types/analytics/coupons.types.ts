import { z } from 'zod';
import {
  AnalyticsStatsQueryParamsSchema,
  AnalyticsListQueryParamsSchema,
  AnalyticsLinksSchema,
} from './common.types.js';

/**
 * Coupon stats totals/subtotals shape
 */
export const AnalyticsCouponStatsSchema = z.object({
  amount: z.number(),
  coupons_count: z.number(),
  orders_count: z.number(),
});
export type AnalyticsCouponStats = z.infer<typeof AnalyticsCouponStatsSchema>;

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
export const AnalyticsCouponSchema = z.object({
  coupon_id: z.number(),
  amount: z.number(),
  orders_count: z.number(),
  extended_info: AnalyticsCouponExtendedInfoSchema.optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsCoupon = z.infer<typeof AnalyticsCouponSchema>;

/**
 * Query parameters for coupons stats endpoint
 */
export const AnalyticsCouponsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    coupons: z.array(z.number()).optional(),
  });
export type AnalyticsCouponsStatsQueryParams = z.infer<
  typeof AnalyticsCouponsStatsQueryParamsSchema
>;

/**
 * Query parameters for coupons list (detail) endpoint
 */
export const AnalyticsCouponsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    coupons: z.array(z.number()).optional(),
  });
export type AnalyticsCouponsListQueryParams = z.infer<
  typeof AnalyticsCouponsListQueryParamsSchema
>;

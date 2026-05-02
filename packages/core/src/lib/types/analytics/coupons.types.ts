import { z } from 'zod';

const AnalyticsIntervalEnum = z.enum([
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);

const AnalyticsStatsQueryParamsSchema = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
  interval: AnalyticsIntervalEnum.optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  force_cache_refresh: z.boolean().optional(),
  fields: z.array(z.string()).optional(),
});

const AnalyticsListQueryParamsSchema = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  extended_info: z.boolean().optional(),
  force_cache_refresh: z.boolean().optional(),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(
  z.string(),
  z.array(AnalyticsLinkSchema)
);

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

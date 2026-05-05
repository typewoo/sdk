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
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  interval: AnalyticsIntervalEnum.default('week')
    .optional()
    .describe('Time interval to use for buckets in the returned data.'),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  orderby: z
    .string()
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
  fields: z
    .array(z.string())
    .optional()
    .describe('Limit stats fields to the specified items.'),
});

const AnalyticsListQueryParamsSchema = z.object({
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  orderby: z
    .string()
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
    .default(false)
    .optional()
    .describe('Add additional piece of info about each coupon to the report.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

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

/**
 * Query parameters for coupons stats endpoint
 */
export const AnalyticsCouponsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    coupons: z
      .array(z.number())
      .optional()
      .describe('Limit result set to coupons assigned specific coupon IDs.'),
    orderby: z
      .enum(['amount', 'coupons_count', 'date', 'orders_count'])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    segmentby: z
      .enum(['category', 'coupon', 'product', 'variation'])
      .optional()
      .describe('Segment the response by additional constraint.'),
  });
export type AnalyticsCouponsStatsQueryParams = z.infer<
  typeof AnalyticsCouponsStatsQueryParamsSchema
>;

/**
 * Query parameters for coupons list (detail) endpoint
 */
export const AnalyticsCouponsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    coupons: z
      .array(z.number())
      .optional()
      .describe('Limit result set to coupons assigned specific coupon IDs.'),
    orderby: z
      .enum(['amount', 'code', 'coupon_id', 'orders_count'])
      .default('coupon_id')
      .optional()
      .describe('Sort collection by object attribute.'),
  });
export type AnalyticsCouponsListQueryParams = z.infer<
  typeof AnalyticsCouponsListQueryParamsSchema
>;

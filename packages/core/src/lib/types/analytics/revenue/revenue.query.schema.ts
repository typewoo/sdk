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

/**
 * Query parameters for revenue stats endpoint
 */
export const AnalyticsRevenueQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.omit({ fields: true }).extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    orderby: z
      .enum([
        'coupons',
        'date',
        'gross_sales',
        'items_sold',
        'net_revenue',
        'orders_count',
        'refunds',
        'shipping',
        'taxes',
        'total_sales',
      ])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    segmentby: z
      .enum(['product', 'category', 'variation', 'coupon', 'customer_type'])
      .optional()
      .describe('Segment the response by additional constraint.'),
    date_type: z
      .enum(['date_paid', 'date_created', 'date_completed'])
      .optional()
      .describe(
        'Override the "woocommerce_date_type" option that is used for the database date field considered for revenue reports.'
      ),
  });
export type AnalyticsRevenueQueryParams = z.infer<
  typeof AnalyticsRevenueQueryParamsSchema
>;

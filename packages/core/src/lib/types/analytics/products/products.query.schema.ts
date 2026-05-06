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
    .default('date')
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
    .describe('Add additional piece of info about each product to the report.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

/**
 * Query parameters for products stats endpoint
 */
export const AnalyticsProductsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
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
        'items_sold',
        'net_revenue',
        'orders_count',
        'refunds',
        'shipping',
        'taxes',
      ])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    categories: z
      .array(z.number())
      .optional()
      .describe('Limit result to items from the specified categories.'),
    products: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified product ids.'),
    segmentby: z
      .enum(['category', 'product', 'variation'])
      .optional()
      .describe('Segment the response by additional constraint.'),
    variations: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified variation ids.'),
  });
export type AnalyticsProductsStatsQueryParams = z.infer<
  typeof AnalyticsProductsStatsQueryParamsSchema
>;

/**
 * Query parameters for products list (detail) endpoint
 */
export const AnalyticsProductsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    orderby: z
      .enum([
        'date',
        'items_sold',
        'net_revenue',
        'orders_count',
        'product_name',
        'sku',
        'variations',
      ])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: status_is, status_is_not, product_includes, product_excludes, coupon_includes, coupon_excludes, customer, categories'
      ),
    categories: z
      .array(z.number())
      .optional()
      .describe('Limit result to items from the specified categories.'),
    products: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified product ids.'),
  });
export type AnalyticsProductsListQueryParams = z.infer<
  typeof AnalyticsProductsListQueryParamsSchema
>;

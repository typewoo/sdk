import { z } from 'zod';

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
  interval: z
    .enum(['hour', 'day', 'week', 'month', 'quarter', 'year'])
    .optional()
    .describe('Time interval to use for buckets in the returned data.'),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  orderby: z
    .string()
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
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
    .describe(
      'Add additional piece of info about each category to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

/**
 * Query parameters for categories stats endpoint
 */
export const AnalyticsCategoriesStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    categories: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to all items that have the specified term assigned in the categories taxonomy.'
      ),
    status_is: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        'Limit result set to items that have the specified order status.'
      ),
    status_is_not: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order status."
      ),
  });
export type AnalyticsCategoriesStatsQueryParams = z.infer<
  typeof AnalyticsCategoriesStatsQueryParamsSchema
>;

/**
 * Query parameters for categories list (detail) endpoint
 */
export const AnalyticsCategoriesListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    interval: z
      .enum(['day', 'hour', 'month', 'quarter', 'week', 'year'])
      .default('week')
      .optional()
      .describe('Time interval to use for buckets in the returned data.'),
    categories: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to all items that have the specified term assigned in the categories taxonomy.'
      ),
    status_is: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        'Limit result set to items that have the specified order status.'
      ),
    status_is_not: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order status."
      ),
    orderby: z
      .enum([
        'category',
        'category_id',
        'items_sold',
        'net_revenue',
        'orders_count',
        'products_count',
      ])
      .default('category_id')
      .optional()
      .describe('Sort collection by object attribute.'),
  });
export type AnalyticsCategoriesListQueryParams = z.infer<
  typeof AnalyticsCategoriesListQueryParamsSchema
>;

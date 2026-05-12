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
    .default('tax_rate_id')
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
    .optional()
    .describe('Add additional piece of info about each tax to the report.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

/**
 * Query parameters for taxes stats endpoint
 */
export const AnalyticsTaxesStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    taxes: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to all items that have the specified term assigned in the taxes taxonomy.'
      ),
    orderby: z
      .enum([
        'date',
        'items_sold',
        'orders_count',
        'products_count',
        'total_sales',
      ])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    segmentby: z
      .enum(['tax_rate_id'])
      .optional()
      .describe('Segment the response by additional constraint.'),
  });
export type AnalyticsTaxesStatsQueryParams = z.infer<
  typeof AnalyticsTaxesStatsQueryParamsSchema
>;

/**
 * Query parameters for taxes list (detail) endpoint
 */
export const AnalyticsTaxesListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.omit({ extended_info: true }).extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    taxes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to items assigned one or more tax rates.'),
    orderby: z
      .enum([
        'name',
        'order_tax',
        'orders_count',
        'rate',
        'shipping_tax',
        'tax_code',
        'tax_rate_id',
        'total_tax',
      ])
      .default('tax_rate_id')
      .optional()
      .describe('Sort collection by object attribute.'),
  });
export type AnalyticsTaxesListQueryParams = z.infer<
  typeof AnalyticsTaxesListQueryParamsSchema
>;

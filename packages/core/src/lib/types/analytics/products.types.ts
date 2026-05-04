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
    .describe(
      'Add additional piece of info about each category to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(z.string(), z.array(AnalyticsLinkSchema));

/**
 * Product stats totals/subtotals shape
 */
export const AnalyticsProductStatsSchema = z.object({
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  products_count: z.number().optional(),
  variations_count: z.number().optional(),
});
export type AnalyticsProductStats = z.infer<typeof AnalyticsProductStatsSchema>;

/**
 * Extended info for a product detail row
 */
export const AnalyticsProductExtendedInfoSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  image: z.string().optional(),
  permalink: z.string().optional(),
  category_ids: z.array(z.number()).optional(),
  stock_status: z.string().optional(),
  stock_quantity: z.number().nullable().optional(),
  manage_stock: z.boolean().optional(),
  low_stock_amount: z.number().nullable().optional(),
  variations: z.array(z.number()).optional(),
  sku: z.string().optional(),
});
export type AnalyticsProductExtendedInfo = z.infer<
  typeof AnalyticsProductExtendedInfoSchema
>;

/**
 * Single product row from the products detail endpoint
 */
export const AnalyticsProductSchema = z.object({
  product_id: z.number().describe('Product ID.'),
  items_sold: z.number().describe('Number of items sold.'),
  net_revenue: z.number().describe('Net revenue.'),
  orders_count: z.number().describe('Number of orders.'),
  extended_info: z.record(z.unknown()).optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsProduct = z.infer<typeof AnalyticsProductSchema>;

/**
 * Query parameters for products stats endpoint
 */
export const AnalyticsProductsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    categories: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to all items that have the specified term assigned in the categories taxonomy.'
      ),
    products: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified product ids.'),
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
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient.'
      ),
    categories: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to all items that have the specified term assigned in the categories taxonomy.'
      ),
    products: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified product ids.'),
  });
export type AnalyticsProductsListQueryParams = z.infer<
  typeof AnalyticsProductsListQueryParamsSchema
>;

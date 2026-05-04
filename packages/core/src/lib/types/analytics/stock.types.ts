import { z } from 'zod';

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
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
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
 * Stock stats totals shape
 */
export const AnalyticsStockStatsSchema = z.object({
  lowstock: z.number(),
  instock: z.number(),
  outofstock: z.number(),
  onbackorder: z.number(),
  products: z.number(),
});
export type AnalyticsStockStats = z.infer<typeof AnalyticsStockStatsSchema>;

/**
 * Single stock row from the stock detail endpoint
 */
export const AnalyticsStockItemSchema = z.object({
  id: z.number().describe('Product ID.'),
  parent_id: z.number().optional().describe('Product parent ID.'),
  name: z.string().describe('Product name.'),
  sku: z.string().optional().describe('Unique identifier.'),
  stock_status: z.string().describe('Stock status.'),
  stock_quantity: z.number().describe('Stock quantity.'),
  manage_stock: z.boolean().optional().describe('Manage stock.'),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsStockItem = z.infer<typeof AnalyticsStockItemSchema>;

/**
 * Query parameters for stock list endpoint
 */
export const AnalyticsStockListQueryParamsSchema = z.object({
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
    .default('stock_status')
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  type: z
    .enum(['all', 'out_of_stock', 'low_stock', 'in_stock', 'on_backorder'])
    .default('all')
    .optional()
    .describe('Limit result set to items assigned a stock report type.'),
  context: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
});
export type AnalyticsStockListQueryParams = z.infer<
  typeof AnalyticsStockListQueryParamsSchema
>;

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
  product_id: z.number(),
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  extended_info: AnalyticsProductExtendedInfoSchema.optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsProduct = z.infer<typeof AnalyticsProductSchema>;

/**
 * Query parameters for products stats endpoint
 */
export const AnalyticsProductsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    categories: z.array(z.number()).optional(),
    products: z.array(z.number()).optional(),
    variations: z.array(z.number()).optional(),
  });
export type AnalyticsProductsStatsQueryParams = z.infer<
  typeof AnalyticsProductsStatsQueryParamsSchema
>;

/**
 * Query parameters for products list (detail) endpoint
 */
export const AnalyticsProductsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    categories: z.array(z.number()).optional(),
    products: z.array(z.number()).optional(),
  });
export type AnalyticsProductsListQueryParams = z.infer<
  typeof AnalyticsProductsListQueryParamsSchema
>;

import { z } from 'zod';

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

export const AnalyticsProductIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsProductStatsSchema,
});
export type AnalyticsProductInterval = z.infer<
  typeof AnalyticsProductIntervalSchema
>;

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
export const AnalyticsProductSchema = z.looseObject({
  product_id: z.number().describe('Product ID.'),
  items_sold: z.number().describe('Number of items sold.'),
  net_revenue: z.number().describe('Total Net sales of all items sold.'),
  orders_count: z.number().describe('Number of orders product appeared in.'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsProduct = z.infer<typeof AnalyticsProductSchema>;

import { z } from 'zod';

/**
 * Stock stats totals shape
 */
export const AnalyticsStockStatsSchema = z.looseObject({
  lowstock: z.number().describe('Number of low stock products.'),
  instock: z.number().describe('Number of In stock products.'),
  outofstock: z.number().describe('Number of Out of stock products.'),
  onbackorder: z.number().describe('Number of On backorder products.'),
  products: z.number().describe('Number of products.'),
});
export type AnalyticsStockStats = z.infer<typeof AnalyticsStockStatsSchema>;

export const AnalyticsStockStatsResponseSchema = z.looseObject({
  totals: AnalyticsStockStatsSchema.describe('Totals data.'),
});
export type AnalyticsStockStatsResponse = z.infer<
  typeof AnalyticsStockStatsResponseSchema
>;

/**
 * Single stock item row from the stock detail endpoint
 */
export const AnalyticsStockItemSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  parent_id: z.number().optional().describe('Product parent ID.'),
  name: z.string().describe('Product name.'),
  sku: z.string().optional().describe('Unique identifier.'),
  stock_status: z
    .enum(['instock', 'onbackorder', 'outofstock'])
    .describe('Stock status.'),
  stock_quantity: z.number().describe('Stock quantity.'),
  manage_stock: z
    .union([z.boolean(), z.enum(['parent'])])
    .optional()
    .describe('Manage stock.'),
});
export type AnalyticsStockItem = z.infer<typeof AnalyticsStockItemSchema>;

import { z } from 'zod';

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

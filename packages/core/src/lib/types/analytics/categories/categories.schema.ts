import { z } from 'zod';

/**
 * Category stats totals/subtotals shape
 */
export const AnalyticsCategoryStatsSchema = z.object({
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  products_count: z.number(),
});
export type AnalyticsCategoryStats = z.infer<
  typeof AnalyticsCategoryStatsSchema
>;

/**
 * Extended info for a category detail row
 */
export const AnalyticsCategoryExtendedInfoSchema = z.object({
  name: z.string().optional(),
});
export type AnalyticsCategoryExtendedInfo = z.infer<
  typeof AnalyticsCategoryExtendedInfoSchema
>;

/**
 * Single category row from the categories detail endpoint
 */
export const AnalyticsCategorySchema = z.looseObject({
  category_id: z.number().describe('Category ID.'),
  items_sold: z.number().describe('Amount of items sold.'),
  net_revenue: z.number().describe('Total sales.'),
  orders_count: z.number().describe('Number of orders.'),
  products_count: z.number().describe('Amount of products.'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsCategory = z.infer<typeof AnalyticsCategorySchema>;

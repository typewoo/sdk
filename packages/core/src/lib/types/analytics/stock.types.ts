import { z } from 'zod';
import {
  AnalyticsListQueryParamsSchema,
  AnalyticsLinksSchema,
} from './common.types.js';

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
  id: z.number(),
  parent_id: z.number().optional(),
  name: z.string(),
  sku: z.string().optional(),
  stock_status: z.string(),
  stock_quantity: z.number().nullable(),
  manage_stock: z.boolean().optional(),
  low_stock_amount: z.number().nullable().optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsStockItem = z.infer<typeof AnalyticsStockItemSchema>;

/**
 * Query parameters for stock list endpoint
 */
export const AnalyticsStockListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    type: z
      .enum(['all', 'out_of_stock', 'low_stock', 'in_stock', 'on_backorder'])
      .optional(),
    status: z.enum(['all', 'publish', 'draft']).optional(),
  });
export type AnalyticsStockListQueryParams = z.infer<
  typeof AnalyticsStockListQueryParamsSchema
>;

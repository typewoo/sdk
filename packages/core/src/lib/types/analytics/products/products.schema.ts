import { z } from 'zod';
import {
  analyticsStatsIntervalSchema,
  analyticsStatsSegmentSchema,
} from '../stats.shared.js';

const productStatsFields = {
  items_sold: z.number().describe('Number of product items sold.'),
  net_revenue: z.number().describe('Net sales.'),
  orders_count: z.number().describe('Number of orders.'),
};

/**
 * A single product stats segment. The API also sends `products_count` and
 * `variations_count` in segment subtotals, which WC's schema omits.
 */
export const AnalyticsProductSegmentSchema = analyticsStatsSegmentSchema(
  z.looseObject({
    ...productStatsFields,
    products_count: z
      .number()
      .optional()
      .describe('Number of distinct products sold.'),
    variations_count: z
      .number()
      .optional()
      .describe('Number of distinct variations sold.'),
  }),
  { labelRequired: true }
);
export type AnalyticsProductSegment = z.infer<
  typeof AnalyticsProductSegmentSchema
>;

/**
 * Product stats totals/subtotals shape
 */
export const AnalyticsProductStatsSchema = z.looseObject({
  ...productStatsFields,
  segments: z
    .array(AnalyticsProductSegmentSchema)
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsProductStats = z.infer<typeof AnalyticsProductStatsSchema>;

export const AnalyticsProductIntervalSchema = analyticsStatsIntervalSchema(
  AnalyticsProductStatsSchema
);
export type AnalyticsProductInterval = z.infer<
  typeof AnalyticsProductIntervalSchema
>;

export const AnalyticsProductsStatsResponseSchema = z.looseObject({
  totals: AnalyticsProductStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsProductIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsProductsStatsResponse = z.infer<
  typeof AnalyticsProductsStatsResponseSchema
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

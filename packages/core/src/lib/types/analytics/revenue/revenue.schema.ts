import { z } from 'zod';

/**
 * Revenue stats totals/subtotals shape
 */
export const AnalyticsRevenueStatsSchema = z.looseObject({
  orders_count: z.number().describe('Number of orders.'),
  num_items_sold: z.number().describe('Items sold.'),
  gross_sales: z.number().describe('Gross sales.'),
  total_sales: z.number().describe('Total sales.'),
  coupons: z.number().describe('Amount discounted by coupons.'),
  coupons_count: z.number().describe('Unique coupons count.'),
  refunds: z.number().describe('Total of returns.'),
  taxes: z.number().describe('Total of taxes.'),
  shipping: z.number().describe('Total of shipping.'),
  net_revenue: z.number().describe('Net sales.'),
  products: z.number().optional().describe('Products sold.'),
  segments: z
    .array(z.looseObject({}))
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsRevenueStats = z.infer<typeof AnalyticsRevenueStatsSchema>;

export const AnalyticsRevenueIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsRevenueStatsSchema,
});
export type AnalyticsRevenueInterval = z.infer<
  typeof AnalyticsRevenueIntervalSchema
>;

export const AnalyticsRevenueStatsResponseSchema = z.looseObject({
  totals: AnalyticsRevenueStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsRevenueIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsRevenueStatsResponse = z.infer<
  typeof AnalyticsRevenueStatsResponseSchema
>;

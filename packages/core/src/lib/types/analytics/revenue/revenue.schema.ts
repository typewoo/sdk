import { z } from 'zod';

/**
 * Revenue stats totals/subtotals shape
 */
export const AnalyticsRevenueStatsSchema = z.object({
  orders_count: z.number(),
  num_items_sold: z.number(),
  gross_sales: z.number(),
  total_sales: z.number(),
  coupons: z.number(),
  coupons_count: z.number(),
  refunds: z.number(),
  taxes: z.number(),
  shipping: z.number(),
  net_revenue: z.number(),
  avg_items_per_order: z.number(),
  avg_order_value: z.number(),
  total_customers: z.number(),
  products: z.number().optional(),
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

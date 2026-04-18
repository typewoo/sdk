import { z } from 'zod';
import { AnalyticsStatsQueryParamsSchema } from './common.types.js';

/**
 * Revenue stats totals/subtotals shape
 */
export const AnalyticsRevenueStatsSchema = z.object({
  total_sales: z.number(),
  net_revenue: z.number(),
  coupons: z.number(),
  coupons_count: z.number(),
  shipping: z.number(),
  taxes: z.number(),
  refunds: z.number(),
  orders_count: z.number(),
  num_items_sold: z.number(),
  gross_sales: z.number(),
  products: z.number().optional(),
});
export type AnalyticsRevenueStats = z.infer<typeof AnalyticsRevenueStatsSchema>;

/**
 * Query parameters for revenue stats endpoint
 */
export const AnalyticsRevenueQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    segmentby: z
      .enum(['product', 'category', 'variation', 'coupon', 'customer_type'])
      .optional(),
    date_type: z
      .enum(['date_paid', 'date_created', 'date_completed'])
      .optional(),
  });
export type AnalyticsRevenueQueryParams = z.infer<
  typeof AnalyticsRevenueQueryParamsSchema
>;

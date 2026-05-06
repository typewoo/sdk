import { z } from 'zod';

/**
 * Allowed indicator descriptor
 */
export const AnalyticsPerformanceAllowedSchema = z.looseObject({
  stat: z
    .enum([
      'coupons/amount',
      'coupons/orders_count',
      'downloads/download_count',
      'orders/avg_order_value',
      'orders/orders_count',
      'products/items_sold',
      'revenue/gross_sales',
      'revenue/net_revenue',
      'revenue/refunds',
      'revenue/shipping',
      'revenue/total_sales',
      'taxes/order_tax',
      'taxes/shipping_tax',
      'taxes/total_tax',
      'variations/items_sold',
    ])
    .describe('Unique identifier for the resource.'),
  chart: z.string().describe('The specific chart this stat referrers to.'),
  label: z.string().describe('Human readable label for the stat.'),
});
export type AnalyticsPerformanceAllowed = z.infer<
  typeof AnalyticsPerformanceAllowedSchema
>;

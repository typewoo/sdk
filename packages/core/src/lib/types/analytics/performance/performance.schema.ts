import { z } from 'zod';

/**
 * A single performance indicator value
 */
export const AnalyticsPerformanceIndicatorSchema = z.looseObject({
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
  label: z.string().optional().describe('Human readable label for the stat.'),
  format: z
    .enum(['currency', 'number'])
    .optional()
    .describe('Format of the stat.'),
  value: z
    .union([z.number(), z.string()])
    .optional()
    .describe(
      'Value of the stat. Returns null if the stat does not exist or cannot be loaded.'
    ),
});
export type AnalyticsPerformanceIndicator = z.infer<
  typeof AnalyticsPerformanceIndicatorSchema
>;

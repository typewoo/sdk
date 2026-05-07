import { z } from 'zod';

/**
 * Order stats totals/subtotals shape
 */
export const AnalyticsOrderStatsSchema = z.looseObject({
  orders_count: z.number().describe('Number of orders'),
  num_items_sold: z.number().describe('Number of items sold'),
  coupons: z.number().describe('Amount discounted by coupons.'),
  coupons_count: z.number().describe('Unique coupons count.'),
  net_revenue: z.number().describe('Net sales.'),
  avg_items_per_order: z.number().describe('Average items per order'),
  avg_order_value: z.number().describe('Average order value.'),
  total_customers: z.number().describe('Total distinct customers.'),
  products: z.number().optional().describe('Number of distinct products sold.'),
  segments: z
    .array(z.looseObject({}))
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsOrderStats = z.infer<typeof AnalyticsOrderStatsSchema>;

export const AnalyticsOrderIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsOrderStatsSchema,
});
export type AnalyticsOrderInterval = z.infer<
  typeof AnalyticsOrderIntervalSchema
>;

export const AnalyticsOrdersStatsResponseSchema = z.looseObject({
  totals: AnalyticsOrderStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsOrderIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsOrdersStatsResponse = z.infer<
  typeof AnalyticsOrdersStatsResponseSchema
>;

/**
 * Extended info for an order detail row
 */
export const AnalyticsOrderExtendedInfoSchema = z.object({
  products: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number(),
      })
    )
    .optional(),
  coupons: z
    .array(
      z.object({
        id: z.number(),
        code: z.string(),
      })
    )
    .optional(),
  customer: z
    .object({
      customer_id: z.number().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  attribution: z.looseObject({}).optional(),
});
export type AnalyticsOrderExtendedInfo = z.infer<
  typeof AnalyticsOrderExtendedInfoSchema
>;

/**
 * Single order row from the orders detail endpoint
 */
export const AnalyticsOrderSchema = z.looseObject({
  order_id: z.number().describe('Order ID.'),
  order_number: z
    .union([z.string(), z.number()])
    .optional()
    .describe('Order Number.'),
  date_created: z
    .string()
    .describe("Date the order was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .optional()
    .describe('Date the order was created, as GMT.'),
  status: z.string().describe('Order status.'),
  customer_id: z.number().describe('Customer ID.'),
  net_total: z.number().describe('Net total revenue.'),
  num_items_sold: z.number().describe('Number of items sold.'),
  customer_type: z.string().optional().describe('Returning or new customer.'),
  total_formatted: z
    .string()
    .optional()
    .describe('Net total revenue (formatted).'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsOrder = z.infer<typeof AnalyticsOrderSchema>;

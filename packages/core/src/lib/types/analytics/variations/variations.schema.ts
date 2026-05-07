import { z } from 'zod';

/**
 * Variation stats totals/subtotals shape
 */
export const AnalyticsVariationStatsSchema = z.looseObject({
  items_sold: z.number().describe('Number of variation items sold.'),
  net_revenue: z.number().describe('Net sales.'),
  orders_count: z.number().describe('Number of orders.'),
  segments: z
    .array(z.looseObject({}))
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsVariationStats = z.infer<
  typeof AnalyticsVariationStatsSchema
>;

export const AnalyticsVariationIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsVariationStatsSchema,
});
export type AnalyticsVariationInterval = z.infer<
  typeof AnalyticsVariationIntervalSchema
>;

export const AnalyticsVariationsStatsResponseSchema = z.looseObject({
  totals: AnalyticsVariationStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsVariationIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsVariationsStatsResponse = z.infer<
  typeof AnalyticsVariationsStatsResponseSchema
>;

/**
 * Extended info for a variation detail row
 */
export const AnalyticsVariationExtendedInfoSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  permalink: z.string().optional(),
  price: z.number().optional(),
  sku: z.string().optional(),
  stock_status: z.string().optional(),
  stock_quantity: z.number().nullable().optional(),
  low_stock_amount: z.number().nullable().optional(),
  attributes: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        option: z.string(),
      })
    )
    .optional(),
});
export type AnalyticsVariationExtendedInfo = z.infer<
  typeof AnalyticsVariationExtendedInfoSchema
>;

/**
 * Single variation row from the variations detail endpoint
 */
export const AnalyticsVariationSchema = z.looseObject({
  product_id: z.number().describe('Product ID.'),
  variation_id: z.number().describe('Product ID.'),
  items_sold: z.number().describe('Number of items sold.'),
  net_revenue: z.number().describe('Total Net sales of all items sold.'),
  orders_count: z.number().describe('Number of orders product appeared in.'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsVariation = z.infer<typeof AnalyticsVariationSchema>;

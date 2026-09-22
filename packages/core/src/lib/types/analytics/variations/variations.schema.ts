import { z } from 'zod';
import {
  analyticsStatsIntervalSchema,
  analyticsStatsSegmentSchema,
} from '../stats.shared.js';

const variationStatsFields = {
  items_sold: z.number().describe('Number of variation items sold.'),
  net_revenue: z.number().describe('Net sales.'),
  orders_count: z.number().describe('Number of orders.'),
  // The API also sends this in totals, interval subtotals and segments,
  // although WC's schema omits it.
  variations_count: z
    .number()
    .optional()
    .describe('Number of distinct variations sold.'),
};

/**
 * A single variation stats segment.
 */
export const AnalyticsVariationSegmentSchema = analyticsStatsSegmentSchema(
  z.looseObject(variationStatsFields),
  { labelRequired: true }
);
export type AnalyticsVariationSegment = z.infer<
  typeof AnalyticsVariationSegmentSchema
>;

/**
 * Variation stats totals/subtotals shape
 */
export const AnalyticsVariationStatsSchema = z.looseObject({
  ...variationStatsFields,
  segments: z
    .array(AnalyticsVariationSegmentSchema)
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsVariationStats = z.infer<
  typeof AnalyticsVariationStatsSchema
>;

export const AnalyticsVariationIntervalSchema = analyticsStatsIntervalSchema(
  AnalyticsVariationStatsSchema
);
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

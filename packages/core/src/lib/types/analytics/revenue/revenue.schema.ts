import { z } from 'zod';
import {
  analyticsStatsIntervalSchema,
  analyticsStatsSegmentSchema,
} from '../stats.shared.js';

const revenueStatsFields = {
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
};

/**
 * Subtotals of a single revenue stats segment. The API omits `gross_sales`
 * here, although WC's schema declares it.
 */
export const AnalyticsRevenueSegmentSchema = analyticsStatsSegmentSchema(
  z.looseObject({
    ...revenueStatsFields,
    gross_sales: revenueStatsFields.gross_sales.optional(),
  })
);
export type AnalyticsRevenueSegment = z.infer<
  typeof AnalyticsRevenueSegmentSchema
>;

/**
 * Revenue stats totals/subtotals shape
 */
export const AnalyticsRevenueStatsSchema = z.looseObject({
  ...revenueStatsFields,
  products: z.number().optional().describe('Products sold.'),
  segments: z
    .array(AnalyticsRevenueSegmentSchema)
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsRevenueStats = z.infer<typeof AnalyticsRevenueStatsSchema>;

/** Interval subtotals: same as the totals, minus `products`. */
export const AnalyticsRevenueIntervalSchema = analyticsStatsIntervalSchema(
  AnalyticsRevenueStatsSchema.omit({ products: true })
);
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

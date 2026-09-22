import { z } from 'zod';
import {
  analyticsStatsIntervalSchema,
  analyticsStatsSegmentSchema,
} from '../stats.shared.js';

const taxStatsFields = {
  tax_codes: z.number().optional().describe('Amount of tax codes.'),
  total_tax: z.number().describe('Total tax.'),
  order_tax: z.number().describe('Order tax.'),
  shipping_tax: z.number().describe('Shipping tax.'),
  orders_count: z.number().describe('Number of orders.'),
};

/**
 * A single tax stats segment
 */
export const AnalyticsTaxSegmentSchema = analyticsStatsSegmentSchema(
  z.looseObject(taxStatsFields)
);
export type AnalyticsTaxSegment = z.infer<typeof AnalyticsTaxSegmentSchema>;

/**
 * Tax stats totals/subtotals shape
 */
export const AnalyticsTaxStatsSchema = z.looseObject({
  ...taxStatsFields,
  segments: z
    .array(AnalyticsTaxSegmentSchema)
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsTaxStats = z.infer<typeof AnalyticsTaxStatsSchema>;

export const AnalyticsTaxIntervalSchema = analyticsStatsIntervalSchema(
  AnalyticsTaxStatsSchema
);
export type AnalyticsTaxInterval = z.infer<typeof AnalyticsTaxIntervalSchema>;

export const AnalyticsTaxesStatsResponseSchema = z.looseObject({
  totals: AnalyticsTaxStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsTaxIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsTaxesStatsResponse = z.infer<
  typeof AnalyticsTaxesStatsResponseSchema
>;

/**
 * Extended info for a tax detail row
 */
export const AnalyticsTaxExtendedInfoSchema = z.object({
  name: z.string().optional(),
  rate: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  priority: z.number().optional(),
});
export type AnalyticsTaxExtendedInfo = z.infer<
  typeof AnalyticsTaxExtendedInfoSchema
>;

/**
 * Single tax row from the taxes detail endpoint
 */
export const AnalyticsTaxSchema = z.looseObject({
  tax_rate_id: z.number().describe('Tax rate ID.'),
  name: z.string().describe('Tax rate name.'),
  tax_rate: z.number().describe('Tax rate.'),
  country: z.string().describe('Country / Region.'),
  state: z.string().describe('State.'),
  priority: z.number().describe('Priority.'),
  total_tax: z.number().describe('Total tax.'),
  order_tax: z.number().describe('Order tax.'),
  shipping_tax: z.number().describe('Shipping tax.'),
  orders_count: z.number().describe('Number of orders.'),
});
export type AnalyticsTax = z.infer<typeof AnalyticsTaxSchema>;

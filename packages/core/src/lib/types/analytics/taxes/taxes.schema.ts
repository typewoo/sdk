import { z } from 'zod';

/**
 * Tax stats totals/subtotals shape
 */
export const AnalyticsTaxStatsSchema = z.looseObject({
  tax_codes: z.number().optional().describe('Amount of tax codes.'),
  total_tax: z.number().describe('Total tax.'),
  order_tax: z.number().describe('Order tax.'),
  shipping_tax: z.number().describe('Shipping tax.'),
  orders_count: z.number().describe('Number of orders.'),
  segments: z
    .array(z.looseObject({}))
    .describe('Reports data grouped by segment condition.'),
});
export type AnalyticsTaxStats = z.infer<typeof AnalyticsTaxStatsSchema>;

export const AnalyticsTaxIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsTaxStatsSchema,
});
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

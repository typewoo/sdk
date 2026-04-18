import { z } from 'zod';
import {
  AnalyticsStatsQueryParamsSchema,
  AnalyticsListQueryParamsSchema,
  AnalyticsLinksSchema,
} from './common.types.js';

/**
 * Tax stats totals/subtotals shape
 */
export const AnalyticsTaxStatsSchema = z.object({
  tax_codes: z.number().optional(),
  total_tax: z.number(),
  order_tax: z.number(),
  shipping_tax: z.number(),
  orders_count: z.number(),
});
export type AnalyticsTaxStats = z.infer<typeof AnalyticsTaxStatsSchema>;

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
export const AnalyticsTaxSchema = z.object({
  tax_rate_id: z.number(),
  name: z.string(),
  tax_rate: z.number(),
  country: z.string(),
  state: z.string(),
  priority: z.number(),
  total_tax: z.number(),
  order_tax: z.number(),
  shipping_tax: z.number(),
  orders_count: z.number(),
  extended_info: AnalyticsTaxExtendedInfoSchema.optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsTax = z.infer<typeof AnalyticsTaxSchema>;

/**
 * Query parameters for taxes stats endpoint
 */
export const AnalyticsTaxesStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    taxes: z.array(z.number()).optional(),
  });
export type AnalyticsTaxesStatsQueryParams = z.infer<
  typeof AnalyticsTaxesStatsQueryParamsSchema
>;

/**
 * Query parameters for taxes list (detail) endpoint
 */
export const AnalyticsTaxesListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    taxes: z.array(z.number()).optional(),
  });
export type AnalyticsTaxesListQueryParams = z.infer<
  typeof AnalyticsTaxesListQueryParamsSchema
>;

import { z } from 'zod';
import { AnalyticsListQueryParamsSchema } from './common.types.js';

/**
 * A single performance indicator value
 */
export const AnalyticsPerformanceIndicatorSchema = z.object({
  stat: z.string(),
  chart: z.string(),
  label: z.string().optional(),
  format: z.string().optional(),
  value: z.union([z.number(), z.string()]).optional(),
});
export type AnalyticsPerformanceIndicator = z.infer<
  typeof AnalyticsPerformanceIndicatorSchema
>;

/**
 * Allowed indicator descriptor
 */
export const AnalyticsPerformanceAllowedSchema = z.object({
  stat: z.string(),
  chart: z.string(),
  label: z.string(),
});
export type AnalyticsPerformanceAllowed = z.infer<
  typeof AnalyticsPerformanceAllowedSchema
>;

/**
 * Query parameters for performance indicators endpoint
 */
export const AnalyticsPerformanceQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    stats: z.string().optional(),
  });
export type AnalyticsPerformanceQueryParams = z.infer<
  typeof AnalyticsPerformanceQueryParamsSchema
>;

import { z } from 'zod';

const AnalyticsListQueryParamsSchema = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  extended_info: z.boolean().optional(),
  force_cache_refresh: z.boolean().optional(),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(
  z.string(),
  z.array(AnalyticsLinkSchema)
);

/**
 * A single performance indicator value
 */
export const AnalyticsPerformanceIndicatorSchema = z.object({
  stat: z.string(),
  chart: z.string(),
  label: z.string().optional(),
  format: z.string().optional(),
  value: z.union([z.number(), z.string()]).optional(),
  _links: AnalyticsLinksSchema.optional(),
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
  _links: AnalyticsLinksSchema.optional(),
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

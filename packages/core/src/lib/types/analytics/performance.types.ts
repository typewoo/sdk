import { z } from 'zod';

const AnalyticsListQueryParamsSchema = z.object({
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  orderby: z
    .string()
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
    .optional()
    .describe(
      'Add additional piece of info about each category to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(z.string(), z.array(AnalyticsLinkSchema));

/**
 * A single performance indicator value
 */
export const AnalyticsPerformanceIndicatorSchema = z.object({
  stat: z.string().describe('Unique identifier for the resource.'),
  chart: z.string().describe('The specific chart this stat referrers to.'),
  label: z.string().optional().describe('Label for the stat.'),
  format: z.string().optional().describe('Format of the stat.'),
  value: z
    .union([z.number(), z.string()])
    .optional()
    .describe(
      'Value of the stat. Returns null if the stat does not exist or cannot be loaded.'
    ),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsPerformanceIndicator = z.infer<
  typeof AnalyticsPerformanceIndicatorSchema
>;

/**
 * Allowed indicator descriptor
 */
export const AnalyticsPerformanceAllowedSchema = z.object({
  stat: z.string().describe('Unique identifier for the resource.'),
  chart: z.string().describe('The specific chart this stat referrers to.'),
  label: z.string().describe('Label for the stat.'),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsPerformanceAllowed = z.infer<
  typeof AnalyticsPerformanceAllowedSchema
>;

/**
 * Query parameters for performance indicators endpoint
 */
export const AnalyticsPerformanceQueryParamsSchema = z.object({
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  context: z
    .string()
    .optional()
    .describe('Scope under which the request is made.'),
  stats: z
    .string()
    .optional()
    .describe('Limit response to specific report stats.'),
});
export type AnalyticsPerformanceQueryParams = z.infer<
  typeof AnalyticsPerformanceQueryParamsSchema
>;

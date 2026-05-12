import { z } from 'zod';

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
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  stats: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Limit response to specific report stats. Allowed values: .'),
});
export type AnalyticsPerformanceQueryParams = z.infer<
  typeof AnalyticsPerformanceQueryParamsSchema
>;

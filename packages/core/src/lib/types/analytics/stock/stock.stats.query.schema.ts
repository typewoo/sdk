import { z } from 'zod';

/**
 * Query parameters for stock stats endpoint (/wc-analytics/reports/stock/stats)
 */
export const AnalyticsStockStatsQueryParamsSchema = z.object({
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});
export type AnalyticsStockStatsQueryParams = z.infer<
  typeof AnalyticsStockStatsQueryParamsSchema
>;

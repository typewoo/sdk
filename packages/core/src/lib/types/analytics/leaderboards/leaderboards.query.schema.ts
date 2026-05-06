import { z } from 'zod';

/**
 * Query parameters for leaderboards endpoint
 */
export const AnalyticsLeaderboardsQueryParamsSchema = z.object({
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
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(5)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  persisted_query: z
    .string()
    .optional()
    .describe('URL query to persist across links.'),
});
export type AnalyticsLeaderboardsQueryParams = z.infer<
  typeof AnalyticsLeaderboardsQueryParamsSchema
>;

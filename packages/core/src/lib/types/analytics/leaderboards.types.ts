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

/**
 * A single leaderboard header cell
 */
export const AnalyticsLeaderboardHeaderSchema = z.object({
  label: z.string(),
});
export type AnalyticsLeaderboardHeader = z.infer<
  typeof AnalyticsLeaderboardHeaderSchema
>;

/**
 * A single value cell in a leaderboard row
 */
export const AnalyticsLeaderboardCellSchema = z.object({
  display: z.string(),
  value: z.union([z.number(), z.string()]),
  format: z.string().optional(),
});
export type AnalyticsLeaderboardCell = z.infer<
  typeof AnalyticsLeaderboardCellSchema
>;

/**
 * A leaderboard contains its metadata and row data
 */
export const AnalyticsLeaderboardSchema = z.object({
  id: z.string().describe('Leaderboard ID.'),
  label: z.string().describe('Displayed title for the leaderboard.'),
  headers: z.array(AnalyticsLeaderboardHeaderSchema).describe('Table headers.'),
  rows: z
    .array(z.array(AnalyticsLeaderboardCellSchema))
    .describe('Table rows.'),
});
export type AnalyticsLeaderboard = z.infer<typeof AnalyticsLeaderboardSchema>;

/**
 * Allowed leaderboard descriptor
 */
export const AnalyticsLeaderboardAllowedSchema = z.object({
  id: z.string().describe('Leaderboard ID.'),
  label: z.string().describe('Displayed title for the leaderboard.'),
  headers: z.array(AnalyticsLeaderboardHeaderSchema).describe('Table headers.'),
});
export type AnalyticsLeaderboardAllowed = z.infer<
  typeof AnalyticsLeaderboardAllowedSchema
>;

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

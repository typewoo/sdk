import { z } from 'zod';
import { AnalyticsListQueryParamsSchema } from './common.types.js';

/**
 * A single row in a leaderboard
 */
export const AnalyticsLeaderboardRowSchema = z.object({
  id: z.number().optional(),
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  href: z.string().optional(),
});
export type AnalyticsLeaderboardRow = z.infer<
  typeof AnalyticsLeaderboardRowSchema
>;

/**
 * A leaderboard contains its metadata and row data
 */
export const AnalyticsLeaderboardSchema = z.object({
  id: z.string(),
  label: z.string(),
  headers: z.array(
    z.object({
      label: z.string(),
    })
  ),
  rows: z.array(z.array(AnalyticsLeaderboardRowSchema)),
});
export type AnalyticsLeaderboard = z.infer<typeof AnalyticsLeaderboardSchema>;

/**
 * Allowed leaderboard descriptor
 */
export const AnalyticsLeaderboardAllowedSchema = z.object({
  id: z.string(),
  label: z.string(),
});
export type AnalyticsLeaderboardAllowed = z.infer<
  typeof AnalyticsLeaderboardAllowedSchema
>;

/**
 * Query parameters for leaderboards endpoint
 */
export const AnalyticsLeaderboardsQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    per_page: z.number().optional(),
    persisted_query: z.string().optional(),
  });
export type AnalyticsLeaderboardsQueryParams = z.infer<
  typeof AnalyticsLeaderboardsQueryParamsSchema
>;

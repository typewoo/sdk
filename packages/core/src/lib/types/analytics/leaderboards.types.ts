import { z } from 'zod';
import { AnalyticsListQueryParamsSchema } from './common.types.js';

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
  id: z.string(),
  label: z.string(),
  headers: z.array(AnalyticsLeaderboardHeaderSchema),
  rows: z.array(z.array(AnalyticsLeaderboardCellSchema)),
});
export type AnalyticsLeaderboard = z.infer<typeof AnalyticsLeaderboardSchema>;

/**
 * Allowed leaderboard descriptor
 */
export const AnalyticsLeaderboardAllowedSchema = z.object({
  id: z.string(),
  label: z.string(),
  headers: z.array(AnalyticsLeaderboardHeaderSchema),
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

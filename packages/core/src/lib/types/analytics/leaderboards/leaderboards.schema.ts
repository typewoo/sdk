import { z } from 'zod';

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

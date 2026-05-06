import { z } from 'zod';
import { AnalyticsLeaderboardHeaderSchema } from './leaderboards.schema.js';

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

import { schemaRegistry } from '../../schema-registry.js';
import { AnalyticsLeaderboardSchema } from './leaderboards.schema.js';
import { AnalyticsLeaderboardAllowedSchema } from './leaderboards.allowed.schema.js';
import { AnalyticsLeaderboardsQueryParamsSchema } from './leaderboards.query.schema.js';

schemaRegistry.add(AnalyticsLeaderboardSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards',
  kind: 'response',
  knownSchemaBugs: [
    {
      field: 'headers',
      reason:
        'Declared as an array of arrays, but the API returns { label } objects.',
    },
  ],
});
schemaRegistry.add(AnalyticsLeaderboardsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsLeaderboardAllowedSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards/allowed',
  kind: 'response',
  knownSchemaBugs: [
    {
      field: 'headers',
      reason:
        'Declared as an array of arrays, but the API returns { label } objects.',
    },
  ],
});

export * from './leaderboards.schema.js';
export * from './leaderboards.allowed.schema.js';
export * from './leaderboards.query.schema.js';

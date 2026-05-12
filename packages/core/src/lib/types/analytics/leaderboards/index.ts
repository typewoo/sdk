import { schemaRegistry } from '../../schema-registry.js';
import { AnalyticsLeaderboardSchema } from './leaderboards.schema.js';
import { AnalyticsLeaderboardAllowedSchema } from './leaderboards.allowed.schema.js';
import { AnalyticsLeaderboardsQueryParamsSchema } from './leaderboards.query.schema.js';

schemaRegistry.add(AnalyticsLeaderboardSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards',
  kind: 'response',
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
});

export * from './leaderboards.schema.js';
export * from './leaderboards.allowed.schema.js';
export * from './leaderboards.query.schema.js';

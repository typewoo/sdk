import { schemaRegistry } from '../../schema-registry.js';
import {
  ANALYTICS_STATS_INTERVAL_ID_BUG,
  ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
} from '../stats.shared.js';
import { AnalyticsRevenueStatsResponseSchema } from './revenue.schema.js';
import { AnalyticsRevenueQueryParamsSchema } from './revenue.query.schema.js';

schemaRegistry.add(AnalyticsRevenueStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/revenue/stats',
  kind: 'response',
  undocumented: ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
  knownSchemaBugs: [ANALYTICS_STATS_INTERVAL_ID_BUG],
});
schemaRegistry.add(AnalyticsRevenueQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/revenue/stats',
  kind: 'query',
  method: 'GET',
});

export * from './revenue.schema.js';
export * from './revenue.query.schema.js';

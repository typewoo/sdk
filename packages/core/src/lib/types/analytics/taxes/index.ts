import { schemaRegistry } from '../../schema-registry.js';
import {
  ANALYTICS_STATS_INTERVAL_ID_BUG,
  ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
} from '../stats.shared.js';
import {
  AnalyticsTaxSchema,
  AnalyticsTaxesStatsResponseSchema,
} from './taxes.schema.js';
import {
  AnalyticsTaxesListQueryParamsSchema,
  AnalyticsTaxesStatsQueryParamsSchema,
} from './taxes.query.schema.js';

schemaRegistry.add(AnalyticsTaxSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes',
  kind: 'response',
});
schemaRegistry.add(AnalyticsTaxesListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsTaxesStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes/stats',
  kind: 'response',
  undocumented: ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
  knownSchemaBugs: [ANALYTICS_STATS_INTERVAL_ID_BUG],
});
schemaRegistry.add(AnalyticsTaxesStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes/stats',
  kind: 'query',
  method: 'GET',
});

export * from './taxes.schema.js';
export * from './taxes.query.schema.js';

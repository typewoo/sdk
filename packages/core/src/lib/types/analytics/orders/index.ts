import { schemaRegistry } from '../../schema-registry.js';
import {
  ANALYTICS_STATS_INTERVAL_ID_BUG,
  ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
} from '../stats.shared.js';
import {
  AnalyticsOrderSchema,
  AnalyticsOrdersStatsResponseSchema,
} from './orders.schema.js';
import {
  AnalyticsOrdersListQueryParamsSchema,
  AnalyticsOrdersStatsQueryParamsSchema,
} from './orders.query.schema.js';

schemaRegistry.add(AnalyticsOrderSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/orders',
  kind: 'response',
});
schemaRegistry.add(AnalyticsOrdersListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/orders',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsOrdersStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/orders/stats',
  kind: 'response',
  undocumented: ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
  knownSchemaBugs: [ANALYTICS_STATS_INTERVAL_ID_BUG],
});
schemaRegistry.add(AnalyticsOrdersStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/orders/stats',
  kind: 'query',
  method: 'GET',
});

export * from './orders.schema.js';
export * from './orders.query.schema.js';

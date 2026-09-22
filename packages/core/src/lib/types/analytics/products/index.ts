import { schemaRegistry } from '../../schema-registry.js';
import {
  ANALYTICS_STATS_INTERVAL_ID_BUG,
  ANALYTICS_STATS_SEGMENT_LABEL_ENUM_BUGS,
} from '../stats.shared.js';
import {
  AnalyticsProductSchema,
  AnalyticsProductsStatsResponseSchema,
} from './products.schema.js';
import {
  AnalyticsProductsListQueryParamsSchema,
  AnalyticsProductsStatsQueryParamsSchema,
} from './products.query.schema.js';

schemaRegistry.add(AnalyticsProductSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/products',
  kind: 'response',
});
schemaRegistry.add(AnalyticsProductsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/products',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsProductsStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/products/stats',
  kind: 'response',
  undocumented: ['products_count', 'variations_count'].flatMap((f) => [
    `totals.${f}`,
    `intervals[].subtotals.${f}`,
    `totals.segments[].subtotals.${f}`,
    `intervals[].subtotals.segments[].subtotals.${f}`,
  ]),
  knownSchemaBugs: [
    ANALYTICS_STATS_INTERVAL_ID_BUG,
    ...ANALYTICS_STATS_SEGMENT_LABEL_ENUM_BUGS,
  ],
});
schemaRegistry.add(AnalyticsProductsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/products/stats',
  kind: 'query',
  method: 'GET',
});

export * from './products.schema.js';
export * from './products.query.schema.js';

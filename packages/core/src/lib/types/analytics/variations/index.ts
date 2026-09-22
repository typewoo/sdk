import { schemaRegistry } from '../../schema-registry.js';
import {
  ANALYTICS_STATS_INTERVAL_ID_BUG,
  ANALYTICS_STATS_SEGMENT_LABEL_ENUM_BUGS,
} from '../stats.shared.js';
import {
  AnalyticsVariationSchema,
  AnalyticsVariationsStatsResponseSchema,
} from './variations.schema.js';
import {
  AnalyticsVariationsListQueryParamsSchema,
  AnalyticsVariationsStatsQueryParamsSchema,
} from './variations.query.schema.js';

schemaRegistry.add(AnalyticsVariationSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations',
  kind: 'response',
});
schemaRegistry.add(AnalyticsVariationsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsVariationsStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations/stats',
  kind: 'response',
  undocumented: [
    'totals.segments[].subtotals.variations_count',
    'intervals[].subtotals.segments[].subtotals.variations_count',
  ],
  knownSchemaBugs: [
    ANALYTICS_STATS_INTERVAL_ID_BUG,
    ...ANALYTICS_STATS_SEGMENT_LABEL_ENUM_BUGS,
  ],
});
schemaRegistry.add(AnalyticsVariationsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations/stats',
  kind: 'query',
  method: 'GET',
});

export * from './variations.schema.js';
export * from './variations.query.schema.js';

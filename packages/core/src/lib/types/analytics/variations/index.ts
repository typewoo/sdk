import { schemaRegistry } from '../../schema-registry.js';
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
});
schemaRegistry.add(AnalyticsVariationsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations/stats',
  kind: 'query',
  method: 'GET',
});

export * from './variations.schema.js';
export * from './variations.query.schema.js';

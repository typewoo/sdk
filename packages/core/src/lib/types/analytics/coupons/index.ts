import { schemaRegistry } from '../../schema-registry.js';
import {
  ANALYTICS_STATS_INTERVAL_ID_BUG,
  ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
} from '../stats.shared.js';
import {
  AnalyticsCouponSchema,
  AnalyticsCouponsStatsResponseSchema,
} from './coupons.schema.js';
import {
  AnalyticsCouponsListQueryParamsSchema,
  AnalyticsCouponsStatsQueryParamsSchema,
} from './coupons.query.schema.js';

schemaRegistry.add(AnalyticsCouponSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons',
  kind: 'response',
});
schemaRegistry.add(AnalyticsCouponsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsCouponsStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons/stats',
  kind: 'response',
  undocumented: ANALYTICS_STATS_SEGMENT_LABEL_FIELDS,
  knownSchemaBugs: [ANALYTICS_STATS_INTERVAL_ID_BUG],
});
schemaRegistry.add(AnalyticsCouponsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons/stats',
  kind: 'query',
  method: 'GET',
});

export * from './coupons.schema.js';
export * from './coupons.query.schema.js';

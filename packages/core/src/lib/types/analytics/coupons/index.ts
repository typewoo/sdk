import { z } from 'zod';
import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsCouponSchema,
  AnalyticsCouponStatsSchema,
  AnalyticsCouponIntervalSchema,
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
schemaRegistry.add(
  z.looseObject({
    totals: AnalyticsCouponStatsSchema,
    intervals: z.array(AnalyticsCouponIntervalSchema).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/coupons/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsCouponsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons/stats',
  kind: 'query',
  method: 'GET',
});

export * from './coupons.schema.js';
export * from './coupons.query.schema.js';

import { z } from 'zod';
import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsRevenueStatsSchema,
  AnalyticsRevenueIntervalSchema,
} from './revenue.schema.js';
import { AnalyticsRevenueQueryParamsSchema } from './revenue.query.schema.js';

schemaRegistry.add(
  z.looseObject({
    totals: AnalyticsRevenueStatsSchema,
    intervals: z.array(AnalyticsRevenueIntervalSchema).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/revenue/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsRevenueQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/revenue/stats',
  kind: 'query',
  method: 'GET',
});

export * from './revenue.schema.js';
export * from './revenue.query.schema.js';

import { schemaRegistry } from '../../schema-registry.js';
import { AnalyticsRevenueStatsResponseSchema } from './revenue.schema.js';
import { AnalyticsRevenueQueryParamsSchema } from './revenue.query.schema.js';

schemaRegistry.add(AnalyticsRevenueStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/revenue/stats',
  kind: 'response',
});
schemaRegistry.add(AnalyticsRevenueQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/revenue/stats',
  kind: 'query',
  method: 'GET',
});

export * from './revenue.schema.js';
export * from './revenue.query.schema.js';

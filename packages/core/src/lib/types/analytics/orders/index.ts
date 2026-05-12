import { schemaRegistry } from '../../schema-registry.js';
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
});
schemaRegistry.add(AnalyticsOrdersStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/orders/stats',
  kind: 'query',
  method: 'GET',
});

export * from './orders.schema.js';
export * from './orders.query.schema.js';

import { schemaRegistry } from '../../schema-registry.js';
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
});
schemaRegistry.add(AnalyticsProductsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/products/stats',
  kind: 'query',
  method: 'GET',
});

export * from './products.schema.js';
export * from './products.query.schema.js';

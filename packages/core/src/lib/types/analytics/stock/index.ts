import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsStockItemSchema,
  AnalyticsStockStatsResponseSchema,
} from './stock.schema.js';
import { AnalyticsStockListQueryParamsSchema } from './stock.query.schema.js';
import { AnalyticsStockStatsQueryParamsSchema } from './stock.stats.query.schema.js';

schemaRegistry.add(AnalyticsStockItemSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/stock',
  kind: 'response',
});
schemaRegistry.add(AnalyticsStockListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/stock',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsStockStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/stock/stats',
  kind: 'response',
});
schemaRegistry.add(AnalyticsStockStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/stock/stats',
  kind: 'query',
  method: 'GET',
});

export * from './stock.schema.js';
export * from './stock.query.schema.js';
export * from './stock.stats.query.schema.js';

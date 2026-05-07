import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsStockItemSchema,
  AnalyticsStockStatsResponseSchema,
} from './stock.schema.js';
import { AnalyticsStockListQueryParamsSchema } from './stock.query.schema.js';

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

export * from './stock.schema.js';
export * from './stock.query.schema.js';

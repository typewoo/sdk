import { z } from 'zod';
import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsStockItemSchema,
  AnalyticsStockStatsSchema,
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
schemaRegistry.add(
  z.looseObject({
    totals: AnalyticsStockStatsSchema,
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/stock/stats',
    kind: 'response',
  }
);

export * from './stock.schema.js';
export * from './stock.query.schema.js';

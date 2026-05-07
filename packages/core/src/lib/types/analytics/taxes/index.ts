import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsTaxSchema,
  AnalyticsTaxesStatsResponseSchema,
} from './taxes.schema.js';
import {
  AnalyticsTaxesListQueryParamsSchema,
  AnalyticsTaxesStatsQueryParamsSchema,
} from './taxes.query.schema.js';

schemaRegistry.add(AnalyticsTaxSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes',
  kind: 'response',
});
schemaRegistry.add(AnalyticsTaxesListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsTaxesStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes/stats',
  kind: 'response',
});
schemaRegistry.add(AnalyticsTaxesStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes/stats',
  kind: 'query',
  method: 'GET',
});

export * from './taxes.schema.js';
export * from './taxes.query.schema.js';

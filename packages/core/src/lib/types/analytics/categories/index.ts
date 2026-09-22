import { schemaRegistry } from '../../schema-registry.js';
import { AnalyticsCategorySchema } from './categories.schema.js';
import { AnalyticsCategoriesListQueryParamsSchema } from './categories.query.schema.js';

schemaRegistry.add(AnalyticsCategorySchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/categories',
  kind: 'response',
});
schemaRegistry.add(AnalyticsCategoriesListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/categories',
  kind: 'query',
  method: 'GET',
});

export * from './categories.schema.js';
export * from './categories.query.schema.js';

import { schemaRegistry } from '../../schema-registry.js';
import { AnalyticsPerformanceIndicatorSchema } from './performance.schema.js';
import { AnalyticsPerformanceAllowedSchema } from './performance.allowed.schema.js';
import { AnalyticsPerformanceQueryParamsSchema } from './performance.query.schema.js';

schemaRegistry.add(AnalyticsPerformanceIndicatorSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/performance-indicators',
  kind: 'response',
});
schemaRegistry.add(AnalyticsPerformanceQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/performance-indicators',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsPerformanceAllowedSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/performance-indicators/allowed',
  kind: 'response',
});

export * from './performance.schema.js';
export * from './performance.allowed.schema.js';
export * from './performance.query.schema.js';

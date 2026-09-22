import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsCustomerSchema,
  AnalyticsCustomersStatsResponseSchema,
} from './customers.schema.js';
import {
  AnalyticsCustomersListQueryParamsSchema,
  AnalyticsCustomersStatsQueryParamsSchema,
} from './customers.query.schema.js';

schemaRegistry.add(AnalyticsCustomerSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/customers',
  kind: 'response',
});
schemaRegistry.add(AnalyticsCustomersListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/customers',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsCustomersStatsResponseSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/customers/stats',
  kind: 'response',
});
schemaRegistry.add(AnalyticsCustomersStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/customers/stats',
  kind: 'query',
  method: 'GET',
});

export * from './customers.schema.js';
export * from './customers.query.schema.js';

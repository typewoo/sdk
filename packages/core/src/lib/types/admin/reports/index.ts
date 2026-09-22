import { schemaRegistry } from '../../schema-registry.js';
import {
  AdminReportSchema,
  AdminSalesReportSchema,
  AdminTopSellersReportSchema,
  AdminTotalsReportEntrySchema,
} from './report.schema.js';
import {
  AdminReportsQueryParamsSchema,
  AdminSalesReportQueryParamsSchema,
  AdminTopSellersReportQueryParamsSchema,
} from './report.query.schema.js';

schemaRegistry.add(AdminReportSchema, {
  surface: 'admin',
  route: '/wc/v3/reports',
  kind: 'response',
});
schemaRegistry.add(AdminSalesReportSchema, {
  surface: 'admin',
  route: '/wc/v3/reports/sales',
  kind: 'response',
  knownSchemaBugs: [
    {
      field: 'total_discount',
      reason:
        'WC declares an integer, but returns the coupon total formatted with number_format() (e.g. "0.00").',
    },
    {
      field: 'totals',
      reason:
        'WC declares an array, but returns an object keyed by period (e.g. "2026-09") with per-period totals.',
    },
  ],
  // Returned by the v1+ controller but missing from its schema.
  undocumented: ['total_customers'],
});
schemaRegistry.add(AdminTopSellersReportSchema, {
  surface: 'admin',
  route: '/wc/v3/reports/top_sellers',
  kind: 'response',
});
schemaRegistry.add(AdminTotalsReportEntrySchema, {
  surface: 'admin',
  route: '/wc/v3/reports/orders/totals',
  kind: 'response',
  alsoAt: [
    '/wc/v3/reports/coupons/totals',
    '/wc/v3/reports/customers/totals',
    '/wc/v3/reports/products/totals',
    '/wc/v3/reports/reviews/totals',
  ],
  knownSchemaBugs: [
    {
      field: 'total',
      reason:
        'WC declares a string, but every totals controller returns an integer count.',
    },
  ],
});
schemaRegistry.add(AdminReportsQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/reports',
  kind: 'query',
  method: 'GET',
  alsoAt: [
    '/wc/v3/reports/coupons/totals',
    '/wc/v3/reports/customers/totals',
    '/wc/v3/reports/orders/totals',
    '/wc/v3/reports/products/totals',
    '/wc/v3/reports/reviews/totals',
  ],
});
schemaRegistry.add(AdminSalesReportQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/reports/sales',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AdminTopSellersReportQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/reports/top_sellers',
  kind: 'query',
  method: 'GET',
});

export * from './report.schema.js';
export * from './report.query.schema.js';

import { z } from 'zod';
import { schemaRegistry } from '../schema-registry.js';
import {
  AnalyticsRevenueStatsSchema,
  AnalyticsRevenueQueryParamsSchema,
} from './revenue.types.js';
import {
  AnalyticsOrderSchema,
  AnalyticsOrderStatsSchema,
  AnalyticsOrdersListQueryParamsSchema,
  AnalyticsOrdersStatsQueryParamsSchema,
} from './orders.types.js';
import {
  AnalyticsProductSchema,
  AnalyticsProductStatsSchema,
  AnalyticsProductsListQueryParamsSchema,
  AnalyticsProductsStatsQueryParamsSchema,
} from './products.types.js';
import {
  AnalyticsCategorySchema,
  AnalyticsCategoriesListQueryParamsSchema,
} from './categories.types.js';
import {
  AnalyticsCouponSchema,
  AnalyticsCouponStatsSchema,
  AnalyticsCouponsListQueryParamsSchema,
  AnalyticsCouponsStatsQueryParamsSchema,
} from './coupons.types.js';
import {
  AnalyticsCustomerSchema,
  AnalyticsCustomerStatsSchema,
  AnalyticsCustomersListQueryParamsSchema,
  AnalyticsCustomersStatsQueryParamsSchema,
} from './customers.types.js';
import {
  AnalyticsDownloadSchema,
  AnalyticsDownloadStatsSchema,
  AnalyticsDownloadsListQueryParamsSchema,
  AnalyticsDownloadsStatsQueryParamsSchema,
} from './downloads.types.js';
import {
  AnalyticsTaxSchema,
  AnalyticsTaxStatsSchema,
  AnalyticsTaxesListQueryParamsSchema,
  AnalyticsTaxesStatsQueryParamsSchema,
} from './taxes.types.js';
import {
  AnalyticsVariationSchema,
  AnalyticsVariationStatsSchema,
  AnalyticsVariationsListQueryParamsSchema,
  AnalyticsVariationsStatsQueryParamsSchema,
} from './variations.types.js';
import {
  AnalyticsStockItemSchema,
  AnalyticsStockStatsSchema,
  AnalyticsStockListQueryParamsSchema,
} from './stock.types.js';
import {
  AnalyticsLeaderboardSchema,
  AnalyticsLeaderboardAllowedSchema,
  AnalyticsLeaderboardsQueryParamsSchema,
} from './leaderboards.types.js';
import {
  AnalyticsPerformanceIndicatorSchema,
  AnalyticsPerformanceAllowedSchema,
  AnalyticsPerformanceQueryParamsSchema,
} from './performance.types.js';

// Revenue
schemaRegistry.add(
  z.object({
    totals: AnalyticsRevenueStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/revenue/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsRevenueQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/revenue/stats',
  kind: 'query',
  method: 'GET',
});
// Orders
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
schemaRegistry.add(
  z.object({
    totals: AnalyticsOrderStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/orders/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsOrdersStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/orders/stats',
  kind: 'query',
  method: 'GET',
});
// Products
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
schemaRegistry.add(
  z.object({
    totals: AnalyticsProductStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/products/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsProductsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/products/stats',
  kind: 'query',
  method: 'GET',
});
// Categories
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
// Coupons
schemaRegistry.add(AnalyticsCouponSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons',
  kind: 'response',
});
schemaRegistry.add(AnalyticsCouponsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(
  z.object({
    totals: AnalyticsCouponStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/coupons/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsCouponsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/coupons/stats',
  kind: 'query',
  method: 'GET',
});
// Customers
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
schemaRegistry.add(z.object({ totals: AnalyticsCustomerStatsSchema }), {
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
// Downloads
schemaRegistry.add(AnalyticsDownloadSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/downloads',
  kind: 'response',
});
schemaRegistry.add(AnalyticsDownloadsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/downloads',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(
  z.object({
    totals: AnalyticsDownloadStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/downloads/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsDownloadsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/downloads/stats',
  kind: 'query',
  method: 'GET',
});
// Taxes
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
schemaRegistry.add(
  z.object({
    totals: AnalyticsTaxStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/taxes/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsTaxesStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/taxes/stats',
  kind: 'query',
  method: 'GET',
});
// Variations
schemaRegistry.add(AnalyticsVariationSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations',
  kind: 'response',
});
schemaRegistry.add(AnalyticsVariationsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(
  z.object({
    totals: AnalyticsVariationStatsSchema,
    intervals: z.array(z.unknown()).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/variations/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsVariationsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/variations/stats',
  kind: 'query',
  method: 'GET',
});
// Stock
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
schemaRegistry.add(z.object({ totals: AnalyticsStockStatsSchema }), {
  surface: 'analytics',
  route: '/wc-analytics/reports/stock/stats',
  kind: 'response',
});
// Leaderboards
schemaRegistry.add(AnalyticsLeaderboardSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards',
  kind: 'response',
});
schemaRegistry.add(AnalyticsLeaderboardsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(AnalyticsLeaderboardAllowedSchema, {
  surface: 'analytics',
  route: '/wc-analytics/leaderboards/allowed',
  kind: 'response',
});
// Performance indicators
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

export * from './common.types.js';
export * from './revenue.types.js';
export * from './orders.types.js';
export * from './products.types.js';
export * from './categories.types.js';
export * from './coupons.types.js';
export * from './taxes.types.js';
export * from './variations.types.js';
export * from './customers.types.js';
export * from './downloads.types.js';
export * from './stock.types.js';
export * from './performance.types.js';
export * from './leaderboards.types.js';

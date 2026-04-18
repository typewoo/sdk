import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';
import type { SdkState } from '../../../types/sdk.state.js';
import { EventBus } from '../../../bus/event.bus.js';
import type { SdkEvent } from '../../../sdk.events.js';

// Mock HTTP helpers
vi.mock('../../../http/http.js', () => ({
  doGet: vi.fn(),
}));

vi.mock('../../../utilities/common.js', () => ({
  extractPagination: vi.fn().mockReturnValue({
    total: 10,
    totalPages: 2,
    currentPage: 1,
    perPage: 5,
  }),
}));

import { doGet } from '../../../http/http.js';
import { AnalyticsRevenueService } from '../../../services/analytics/revenue.service.js';
import { AnalyticsOrdersService } from '../../../services/analytics/orders.service.js';
import { AnalyticsProductsService } from '../../../services/analytics/products.service.js';
import { AnalyticsCategoriesService } from '../../../services/analytics/categories.service.js';
import { AnalyticsCouponsService } from '../../../services/analytics/coupons.service.js';
import { AnalyticsTaxesService } from '../../../services/analytics/taxes.service.js';
import { AnalyticsVariationsService } from '../../../services/analytics/variations.service.js';
import { AnalyticsCustomersService } from '../../../services/analytics/customers.service.js';
import { AnalyticsDownloadsService } from '../../../services/analytics/downloads.service.js';
import { AnalyticsStockService } from '../../../services/analytics/stock.service.js';
import { AnalyticsPerformanceService } from '../../../services/analytics/performance.service.js';
import { AnalyticsLeaderboardsService } from '../../../services/analytics/leaderboards.service.js';
import { AnalyticsService } from '../../../services/analytics.service.js';

const doGetMock = vi.mocked(doGet);

function makeTestDeps() {
  const state: SdkState = {};
  const config: ResolvedSdkConfig = {
    baseUrl: 'https://store.test',
    uniqueIdentifier: 'analytics-test-sdk',
    request: {
      retry: {
        enabled: false,
      },
    },
  };
  const events = new EventBus<SdkEvent>();
  return { state, config, events };
}

describe('Analytics Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // Revenue
  // ──────────────────────────────────────────────
  describe('AnalyticsRevenueService', () => {
    it('getStats calls doGet with correct URL when no params', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsRevenueService(
        deps.state,
        deps.config,
        deps.events
      );
      const mockResponse = {
        data: {
          totals: { total_sales: 1000, net_revenue: 900 },
          intervals: [],
        },
        error: undefined,
      };
      doGetMock.mockResolvedValueOnce(mockResponse);

      const result = await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/revenue/stats',
        undefined
      );
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeUndefined();
    });

    it('getStats appends query params', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsRevenueService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });

      await svc.getStats({ before: '2026-01-31', after: '2026-01-01' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('before=2026-01-31');
      expect(url).toContain('after=2026-01-01');
    });

    it('getStats returns error on failure', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsRevenueService(
        deps.state,
        deps.config,
        deps.events
      );
      const mockError = {
        data: undefined,
        error: {
          code: 'rest_error',
          message: 'Bad request',
          data: {
            status: 400,
          },
          details: {},
        },
      };
      doGetMock.mockResolvedValueOnce(mockError);

      const result = await svc.getStats();

      expect(result.error).toEqual(mockError.error);
      expect(result.data).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────
  // Orders
  // ──────────────────────────────────────────────
  describe('AnalyticsOrdersService', () => {
    it('getStats calls doGet with /stats endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsOrdersService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats({ interval: 'day' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/orders/stats');
      expect(url).toContain('interval=day');
    });

    it('list returns a PaginatedRequest', () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsOrdersService(
        deps.state,
        deps.config,
        deps.events
      );

      const paginatedRequest = svc.list({ per_page: 10 });

      expect(paginatedRequest).toBeDefined();
      expect(typeof paginatedRequest.then).toBe('function');
      expect(typeof paginatedRequest.loop).toBe('function');
    });

    it('list.send() calls doGet with list endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsOrdersService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: [{ order_id: 1, num_items_sold: 3 }],
        headers: {},
      });

      const result = await svc.list({ per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/orders');
      expect(url).not.toContain('/stats');
      expect(url).toContain('per_page=5');
      expect(result.data).toBeDefined();
    });
  });

  // ──────────────────────────────────────────────
  // Products
  // ──────────────────────────────────────────────
  describe('AnalyticsProductsService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsProductsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/products/stats',
        undefined
      );
    });

    it('list returns PaginatedRequest with correct URL', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsProductsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list({ products: [1, 2] });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/products?');
      expect(url).toContain('products');
    });
  });

  // ──────────────────────────────────────────────
  // Categories
  // ──────────────────────────────────────────────
  describe('AnalyticsCategoriesService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsCategoriesService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/categories/stats',
        undefined
      );
    });

    it('list calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsCategoriesService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list();

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toBe('/wp-json/wc-analytics/reports/categories');
    });
  });

  // ──────────────────────────────────────────────
  // Coupons
  // ──────────────────────────────────────────────
  describe('AnalyticsCouponsService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsCouponsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/coupons/stats',
        undefined
      );
    });

    it('list returns PaginatedRequest', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsCouponsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 3 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/coupons?');
      expect(result.pagination).toBeDefined();
    });
  });

  // ──────────────────────────────────────────────
  // Taxes
  // ──────────────────────────────────────────────
  describe('AnalyticsTaxesService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsTaxesService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/taxes/stats',
        undefined
      );
    });

    it('list calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsTaxesService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list();

      expect(doGetMock).toHaveBeenCalledTimes(1);
      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toBe('/wp-json/wc-analytics/reports/taxes');
    });
  });

  // ──────────────────────────────────────────────
  // Variations
  // ──────────────────────────────────────────────
  describe('AnalyticsVariationsService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsVariationsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/variations/stats',
        undefined
      );
    });

    it('list calls correct endpoint with params', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsVariationsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list({ products: [42] });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/variations?');
      expect(url).toContain('products');
    });
  });

  // ──────────────────────────────────────────────
  // Customers
  // ──────────────────────────────────────────────
  describe('AnalyticsCustomersService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsCustomersService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/customers/stats',
        undefined
      );
    });

    it('list calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsCustomersService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list();

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toBe('/wp-json/wc-analytics/reports/customers');
    });
  });

  // ──────────────────────────────────────────────
  // Downloads
  // ──────────────────────────────────────────────
  describe('AnalyticsDownloadsService', () => {
    it('getStats calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsDownloadsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { totals: {}, intervals: [] },
      });

      await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/downloads/stats',
        undefined
      );
    });

    it('list calls correct endpoint with filters', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsDownloadsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list({ product_includes: [10, 20] });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/downloads?');
      expect(url).toContain('product_includes');
    });
  });

  // ──────────────────────────────────────────────
  // Stock
  // ──────────────────────────────────────────────
  describe('AnalyticsStockService', () => {
    it('getStats calls correct endpoint (no params)', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsStockService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: { products: 100, out_of_stock: 5, low_stock: 10, in_stock: 80 },
      });

      const result = await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/stock/stats',
        undefined
      );
      expect(result.data?.products).toBe(100);
    });

    it('list calls correct endpoint with type filter', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsStockService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.list({ type: 'low_stock' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('type=low_stock');
    });
  });

  // ──────────────────────────────────────────────
  // Performance Indicators
  // ──────────────────────────────────────────────
  describe('AnalyticsPerformanceService', () => {
    it('getIndicators calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsPerformanceService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: [{ stat: 'revenue/total_sales', value: 5000 }],
      });

      const result = await svc.getIndicators({
        stats: 'revenue/total_sales,orders/orders_count',
      });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain(
        '/wp-json/wc-analytics/reports/performance-indicators'
      );
      expect(url).toContain('stats=');
      expect(result.data).toHaveLength(1);
    });

    it('getAllowed calls /allowed endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsPerformanceService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: [{ stat: 'revenue/total_sales' }],
      });

      await svc.getAllowed();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/performance-indicators/allowed',
        undefined
      );
    });
  });

  // ──────────────────────────────────────────────
  // Leaderboards
  // ──────────────────────────────────────────────
  describe('AnalyticsLeaderboardsService', () => {
    it('list calls correct endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'customers', label: 'Top Customers' }],
      });

      const result = await svc.list({
        before: '2026-01-31',
        after: '2026-01-01',
      });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/leaderboards');
      expect(url).toContain('before=2026-01-31');
      expect(result.data).toHaveLength(1);
    });

    it('getAllowed calls /allowed endpoint', async () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(
        deps.state,
        deps.config,
        deps.events
      );
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'customers' }],
      });

      await svc.getAllowed();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/leaderboards/allowed',
        undefined
      );
    });
  });

  // ──────────────────────────────────────────────
  // Aggregator
  // ──────────────────────────────────────────────
  describe('AnalyticsService (aggregator)', () => {
    it('exposes all 12 sub-service getters', () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsService(deps.state, deps.config, deps.events);

      expect(svc.revenue).toBeInstanceOf(AnalyticsRevenueService);
      expect(svc.orders).toBeInstanceOf(AnalyticsOrdersService);
      expect(svc.products).toBeInstanceOf(AnalyticsProductsService);
      expect(svc.categories).toBeInstanceOf(AnalyticsCategoriesService);
      expect(svc.coupons).toBeInstanceOf(AnalyticsCouponsService);
      expect(svc.taxes).toBeInstanceOf(AnalyticsTaxesService);
      expect(svc.variations).toBeInstanceOf(AnalyticsVariationsService);
      expect(svc.customers).toBeInstanceOf(AnalyticsCustomersService);
      expect(svc.downloads).toBeInstanceOf(AnalyticsDownloadsService);
      expect(svc.stock).toBeInstanceOf(AnalyticsStockService);
      expect(svc.performance).toBeInstanceOf(AnalyticsPerformanceService);
      expect(svc.leaderboards).toBeInstanceOf(AnalyticsLeaderboardsService);
    });

    it('lazy-initializes sub-services (same instance on repeat access)', () => {
      const deps = makeTestDeps();
      const svc = new AnalyticsService(deps.state, deps.config, deps.events);

      const rev1 = svc.revenue;
      const rev2 = svc.revenue;
      expect(rev1).toBe(rev2);

      const orders1 = svc.orders;
      const orders2 = svc.orders;
      expect(orders1).toBe(orders2);
    });
  });
});

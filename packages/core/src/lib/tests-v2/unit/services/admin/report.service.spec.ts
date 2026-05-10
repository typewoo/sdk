import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({
  doGet: vi.fn(),
  doPost: vi.fn(),
  doPut: vi.fn(),
  doDelete: vi.fn(),
}));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi
    .fn()
    .mockReturnValue({ total: 10, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { AdminReportService } from '../../../../services/admin/report.service.js';

const doGetMock = vi.mocked(doGet);

describe('AdminReportService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminReportService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/reports', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/reports');
      expect(result.pagination?.total).toBe(10);
    });
  });

  describe('getSalesReport()', () => {
    it('calls GET /wc/v3/reports/sales', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ total_sales: '100.00' }],
        error: undefined,
      });

      const result = await svc.getSalesReport();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/sales'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getTopSellersReport()', () => {
    it('calls GET /wc/v3/reports/top_sellers', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getTopSellersReport();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/top_sellers'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getCustomersReport()', () => {
    it('calls GET /wc/v3/reports/customers/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getCustomersReport();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/customers/totals'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getOrdersReport()', () => {
    it('calls GET /wc/v3/reports/orders/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ slug: 'pending', name: 'Pending', total: 5 }],
        error: undefined,
      });

      const result = await svc.getOrdersReport();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/orders/totals'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getOrdersTotals()', () => {
    it('calls GET /wc/v3/reports/orders/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getOrdersTotals();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/orders/totals'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getProductsTotals()', () => {
    it('calls GET /wc/v3/reports/products/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getProductsTotals();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/products/totals'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getCustomersTotals()', () => {
    it('calls GET /wc/v3/reports/customers/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getCustomersTotals();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/customers/totals'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getCouponsTotals()', () => {
    it('calls GET /wc/v3/reports/coupons/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getCouponsTotals();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/coupons/totals'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getReviewsTotals()', () => {
    it('calls GET /wc/v3/reports/reviews/totals', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminReportService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.getReviewsTotals();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/reports/reviews/totals'
      );
      expect(result.pagination).toBeDefined();
    });
  });
});

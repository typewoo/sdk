import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({ doGet: vi.fn() }));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi.fn().mockReturnValue({
    total: 20,
    totalPages: 2,
    currentPage: 1,
    perPage: 10,
  }),
}));

import { doGet } from '../../../../http/http.js';
import { AnalyticsOrdersService } from '../../../../services/analytics/orders.service.js';

const doGetMock = vi.mocked(doGet);

describe('AnalyticsOrdersService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getStats()', () => {
    it('calls /orders/stats URL with no params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { totals: { orders_count: 5 }, intervals: [] },
        error: undefined,
      });

      const result = await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/orders/stats',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual({
        totals: { orders_count: 5 },
        intervals: [],
      });
    });

    it('appends query params to stats URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });

      await svc.getStats({ interval: 'day', after: '2026-01-01' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('interval=day');
      expect(url).toContain('after=2026-01-01');
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_view',
        message: 'Sorry, you cannot list resources.',
        data: { status: 403 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({ data: undefined, error: mockError });

      const result = await svc.getStats();

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('list()', () => {
    it('returns a PaginatedRequest (has .then and .loop)', () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      const req = svc.list({ per_page: 5 });
      expect(typeof req.then).toBe('function');
      expect(typeof req.loop).toBe('function');
    });

    it('awaiting list calls /orders URL (not /stats)', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [{ order_id: 1 }], headers: {} });

      const result = await svc.list({ per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/orders');
      expect(url).not.toContain('/stats');
      expect(url).toContain('per_page=5');
      expect(result.data).toBeDefined();
    });

    it('list result includes pagination metadata', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();

      expect(result.pagination).toEqual({
        total: 20,
        totalPages: 2,
        currentPage: 1,
        perPage: 10,
      });
    });

    it('returns error when list request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsOrdersService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_list',
        message: 'Cannot list orders.',
        data: { status: 403 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: mockError,
        headers: {},
      });

      const result = await svc.list();

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual(mockError);
    });
  });
});

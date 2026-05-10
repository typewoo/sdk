import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({ doGet: vi.fn() }));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi.fn().mockReturnValue({
    total: 25,
    totalPages: 3,
    currentPage: 1,
    perPage: 10,
  }),
}));

import { doGet } from '../../../../http/http.js';
import { AnalyticsVariationsService } from '../../../../services/analytics/variations.service.js';

const doGetMock = vi.mocked(doGet);

describe('AnalyticsVariationsService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getStats()', () => {
    it('calls /variations/stats URL with no params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsVariationsService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { totals: { items_sold: 40 }, intervals: [] },
        error: undefined,
      });

      const result = await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/variations/stats',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('appends query params to stats URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsVariationsService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });

      await svc.getStats({ after: '2026-01-01', interval: 'quarter' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('after=2026-01-01');
      expect(url).toContain('interval=quarter');
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsVariationsService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_view',
        message: 'Sorry, you cannot view.',
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
      const svc = new AnalyticsVariationsService(state, config, events);
      const req = svc.list();
      expect(typeof req.then).toBe('function');
      expect(typeof req.loop).toBe('function');
    });

    it('awaiting list calls /variations URL (not /stats)', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsVariationsService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ variation_id: 5 }],
        headers: {},
      });

      const result = await svc.list({ per_page: 10 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/variations');
      expect(url).not.toContain('/stats');
      expect(url).toContain('per_page=10');
      expect(result.data).toBeDefined();
    });

    it('list result includes pagination metadata', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsVariationsService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();

      expect(result.pagination).toEqual({
        total: 25,
        totalPages: 3,
        currentPage: 1,
        perPage: 10,
      });
    });

    it('returns error when list request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsVariationsService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_list',
        message: 'Cannot list variations.',
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

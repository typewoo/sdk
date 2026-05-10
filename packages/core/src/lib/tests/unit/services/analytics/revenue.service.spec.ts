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
import { AnalyticsRevenueService } from '../../../../services/analytics/revenue.service.js';

const doGetMock = vi.mocked(doGet);

describe('AnalyticsRevenueService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getStats()', () => {
    it('calls correct URL with no params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { totals: { net_revenue: 500 }, intervals: [] },
        error: undefined,
      });

      const result = await svc.getStats();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/revenue/stats',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual({
        totals: { net_revenue: 500 },
        intervals: [],
      });
    });

    it('appends query params to URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });

      await svc.getStats({
        after: '2026-01-01',
        before: '2026-01-31',
        interval: 'day',
      });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('after=2026-01-01');
      expect(url).toContain('before=2026-01-31');
      expect(url).toContain('interval=day');
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events);
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

    it('forwards RequestOptions to doGet', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });
      const options = { signal: new AbortController().signal };

      await svc.getStats(undefined, options);

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/revenue/stats',
        options
      );
    });
  });
});

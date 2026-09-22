import { describe, it, expect, expectTypeOf, vi, beforeEach } from 'vitest';
import type { AnalyticsRevenueStatsResponse } from '../../../../types/index.js';
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
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events, http);
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
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events, http);
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

    it('encodes reserved characters in query values', async () => {
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events, http);
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });

      await svc.getStats({ after: '2026-01-01T00:00:00+02:00&per_page=1' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain(
        'after=2026-01-01T00%3A00%3A00%2B02%3A00%26per_page%3D1'
      );
      expect(new URLSearchParams(url.split('?')[1]).has('per_page')).toBe(
        false
      );
    });

    it('types the response with the per-report revenue stats schema', () => {
      type Data = Awaited<
        ReturnType<AnalyticsRevenueService['getStats']>
      >['data'];
      expectTypeOf<Data>().toEqualTypeOf<
        AnalyticsRevenueStatsResponse | undefined
      >();
      type Segment =
        AnalyticsRevenueStatsResponse['totals']['segments'][number];
      expectTypeOf<Segment['segment_id']>().toEqualTypeOf<number | string>();
      expectTypeOf<Segment['segment_label']>().toEqualTypeOf<
        string | null | undefined
      >();
    });

    it('returns error when request fails', async () => {
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events, http);
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
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsRevenueService(state, config, events, http);
      doGetMock.mockResolvedValueOnce({ data: { totals: {}, intervals: [] } });
      const options = { axiosConfig: { signal: new AbortController().signal } };

      await svc.getStats(undefined, options);

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/revenue/stats',
        options
      );
    });
  });
});

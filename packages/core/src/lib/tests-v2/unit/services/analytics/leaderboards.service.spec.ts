import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({ doGet: vi.fn() }));

import { doGet } from '../../../../http/http.js';
import { AnalyticsLeaderboardsService } from '../../../../services/analytics/leaderboards.service.js';

const doGetMock = vi.mocked(doGet);

describe('AnalyticsLeaderboardsService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('calls /leaderboards URL with no params (returns ApiResult, not PaginatedRequest)', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'customers', label: 'Top Customers', rows: [] }],
        error: undefined,
      });

      const result = await svc.list();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/leaderboards',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('appends query params to URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], error: undefined });

      await svc.list({ after: '2026-01-01', per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('after=2026-01-01');
      expect(url).toContain('per_page=5');
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_view',
        message: 'Sorry, you cannot view.',
        data: { status: 403 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({ data: undefined, error: mockError });

      const result = await svc.list();

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('getAllowed()', () => {
    it('calls /leaderboards/allowed URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'customers', label: 'Top Customers' }],
        error: undefined,
      });

      const result = await svc.getAllowed();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/leaderboards/allowed',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsLeaderboardsService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_view',
        message: 'Cannot view allowed leaderboards.',
        data: { status: 403 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({ data: undefined, error: mockError });

      const result = await svc.getAllowed();

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual(mockError);
    });
  });
});

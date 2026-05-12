import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({ doGet: vi.fn() }));

import { doGet } from '../../../../http/http.js';
import { AnalyticsPerformanceService } from '../../../../services/analytics/performance.service.js';

const doGetMock = vi.mocked(doGet);

describe('AnalyticsPerformanceService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getIndicators()', () => {
    it('calls /performance-indicators URL with no params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsPerformanceService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ stat: 'revenue/gross_revenue', value: 1000 }],
        error: undefined,
      });

      const result = await svc.getIndicators();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/performance-indicators',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('appends query params to URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsPerformanceService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], error: undefined });

      await svc.getIndicators({
        after: '2026-01-01',
        stats: 'revenue/gross_revenue,orders/net_revenue',
      });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('after=2026-01-01');
      expect(url).toContain('stats=revenue');
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsPerformanceService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_view',
        message: 'Sorry, you cannot view.',
        data: { status: 403 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({ data: undefined, error: mockError });

      const result = await svc.getIndicators();

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('getAllowed()', () => {
    it('calls /performance-indicators/allowed URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsPerformanceService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ stat: 'revenue/gross_revenue', label: 'Gross Revenue' }],
        error: undefined,
      });

      const result = await svc.getAllowed();

      expect(doGetMock).toHaveBeenCalledWith(
        '/wp-json/wc-analytics/reports/performance-indicators/allowed',
        undefined
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AnalyticsPerformanceService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_cannot_view',
        message: 'Cannot view allowed indicators.',
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

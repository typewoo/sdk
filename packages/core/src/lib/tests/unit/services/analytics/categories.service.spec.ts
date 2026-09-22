import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({ doGet: vi.fn() }));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi.fn().mockReturnValue({
    total: 30,
    totalPages: 3,
    currentPage: 1,
    perPage: 10,
  }),
}));

import { doGet } from '../../../../http/http.js';
import { AnalyticsCategoriesService } from '../../../../services/analytics/categories.service.js';

const doGetMock = vi.mocked(doGet);

describe('AnalyticsCategoriesService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest (has .then and .loop)', () => {
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsCategoriesService(state, config, events, http);
      const req = svc.list();
      expect(typeof req.then).toBe('function');
      expect(typeof req.loop).toBe('function');
    });

    it('awaiting list calls /categories URL (not /stats)', async () => {
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsCategoriesService(state, config, events, http);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc-analytics/reports/categories');
      expect(url).not.toContain('/stats');
      expect(url).toContain('per_page=5');
      expect(result.data).toBeDefined();
    });

    it('list result includes pagination metadata', async () => {
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsCategoriesService(state, config, events, http);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();

      expect(result.pagination).toEqual({
        total: 30,
        totalPages: 3,
        currentPage: 1,
        perPage: 10,
      });
    });

    it('returns error when list request fails', async () => {
      const { state, config, events, http } = makeTestDeps();
      const svc = new AnalyticsCategoriesService(state, config, events, http);
      const mockError = {
        code: 'woocommerce_rest_cannot_list',
        message: 'Cannot list categories.',
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

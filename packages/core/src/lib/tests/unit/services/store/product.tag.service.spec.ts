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
    .mockReturnValue({ total: 9, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { ProductTagService } from '../../../../services/store/product.tag.service.js';

const doGetMock = vi.mocked(doGet);

describe('ProductTagService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new ProductTagService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/store/v1/products/tags', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductTagService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/tags'
      );
      expect(result.pagination?.total).toBe(9);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductTagService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
        headers: {},
      });

      const result = await svc.list();
      expect(result.error).toBeDefined();
    });
  });
});

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
    .mockReturnValue({ total: 5, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { ProductAttributeTermService } from '../../../../services/store/product.attribute.term.service.js';

const doGetMock = vi.mocked(doGet);

describe('ProductAttributeTermService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new ProductAttributeTermService(state, config, events).list(1)
          .then
      ).toBe('function');
    });

    it('calls GET /wc/store/v1/products/attributes/{attributeId}/terms', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductAttributeTermService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.list(3, { per_page: 5 });

      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/attributes/3/terms'
      );
      expect(result.pagination?.total).toBe(5);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductAttributeTermService(state, config, events);
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

      const result = await svc.list(1);
      expect(result.error).toBeDefined();
    });
  });
});

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
    .mockReturnValue({ total: 8, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { ProductAttributeService } from '../../../../services/store/product.attribute.service.js';

const doGetMock = vi.mocked(doGet);

describe('ProductAttributeService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('calls GET /wc/store/v1/products/attributes and returns ApiPaginationResult directly', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductAttributeService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 1, name: 'Color' }],
        headers: {},
        error: undefined,
      });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/attributes'
      );
      expect(result.pagination).toBeDefined();
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductAttributeService(state, config, events);
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

  describe('single()', () => {
    it('calls GET /wc/store/v1/products/attributes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductAttributeService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 1, name: 'Color' },
        error: undefined,
      });

      const result = await svc.single(1);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/attributes/1'
      );
      expect(result.data).toBeDefined();
    });
  });
});

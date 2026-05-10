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

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductCategoryService } from '../../../../services/admin/product-category.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminProductCategoryService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductCategoryService(state, config, events).list()
          .then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products/categories', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products/categories');
      expect(url).toContain('per_page=5');
      expect(result.pagination).toBeDefined();
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'err',
          message: 'x',
          data: { status: 500 },
          details: {},
        },
        headers: {},
      });
      const result = await svc.list();
      expect(result.error).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/products/categories/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 3, name: 'Shoes' },
        error: undefined,
      });

      const result = await svc.get(3);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/categories/3'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/products/categories', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 10, name: 'Hats' },
        error: undefined,
      });

      const result = await svc.create({ name: 'Hats' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/categories'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/products/categories/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 3, name: 'Updated Shoes' },
        error: undefined,
      });

      const result = await svc.update(3, { name: 'Updated Shoes' });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/categories/3'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/products/categories/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 3 }, error: undefined });

      await svc.delete(3, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/categories/3'
      );
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/products/categories/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductCategoryService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [1] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/categories/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

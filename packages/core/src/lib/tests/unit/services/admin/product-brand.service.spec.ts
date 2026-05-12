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
    .mockReturnValue({ total: 6, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductBrandService } from '../../../../services/admin/product-brand.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminProductBrandService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductBrandService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products/brands', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 10 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products/brands');
      expect(result.pagination?.total).toBe(6);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
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
    it('calls GET /wc/v3/products/brands/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 2, name: 'Nike' },
        error: undefined,
      });

      const result = await svc.get(2);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/brands/2'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/products/brands', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 3, name: 'Adidas' },
        error: undefined,
      });

      const result = await svc.create({ name: 'Adidas' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/brands'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/products/brands/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 2, name: 'Updated Nike' },
        error: undefined,
      });

      const result = await svc.update(2, { name: 'Updated Nike' });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/brands/2'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/products/brands/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 2 }, error: undefined });

      await svc.delete(2, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/brands/2'
      );
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/products/brands/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductBrandService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [2] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/brands/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

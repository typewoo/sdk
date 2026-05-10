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
    .mockReturnValue({ total: 20, totalPages: 2, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { ProductService } from '../../../../services/store/product.service.js';

const doGetMock = vi.mocked(doGet);

describe('ProductService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(typeof new ProductService(state, config, events).list().then).toBe(
        'function'
      );
    });

    it('calls GET /wc/store/v1/products', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.list({ per_page: 5 });

      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products'
      );
      expect(result.pagination?.total).toBe(20);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductService(state, config, events);
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
    it('calls GET /wc/store/v1/products/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 42, name: 'Test Product' },
        error: undefined,
      });

      const result = await svc.single({ id: 42 });
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/42'
      );
      expect(result.data).toBeDefined();
    });

    it('calls GET /wc/store/v1/products/{slug} when slug given', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 10, slug: 'my-product' },
        error: undefined,
      });

      const result = await svc.single({ slug: 'my-product' });
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/my-product'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when product not found', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_product_invalid_id',
          message: 'Not found',
          data: { status: 404 },
          details: {},
        },
      });

      const result = await svc.single({ id: 999 });
      expect(result.error?.code).toBe('woocommerce_rest_product_invalid_id');
    });
  });
});

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
    .mockReturnValue({ total: 3, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductService } from '../../../../services/admin/product.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminProductService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Core CRUD ─────────────────────────────────────────────────────────────

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products with params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 10, status: 'publish' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products');
      expect(url).toContain('per_page=10');
      expect(result.pagination?.total).toBe(3);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
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

  describe('getById()', () => {
    it('calls GET /wc/v3/products/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 42, name: 'Shirt' },
        error: undefined,
      });

      const result = await svc.getById(42);

      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/42'
      );
      expect(result.data).toBeDefined();
    });

    it('returns 404 error when product not found', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_product_invalid_id',
        message: 'Not found',
        data: { status: 404 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({ data: undefined, error: mockError });

      const result = await svc.getById(999);
      expect(result.error?.code).toBe('woocommerce_rest_product_invalid_id');
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/products with product body', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 1, name: 'New Product' },
        error: undefined,
      });

      const result = await svc.create({
        name: 'New Product',
        type: 'simple',
        regular_price: '10.00',
      });

      expect(doPostMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/products');
      expect(doPostMock.mock.calls[0][0]).not.toContain('/batch');
      expect(result.data).toBeDefined();
    });

    it('returns error when create fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_missing_name',
          message: 'Missing name',
          data: { status: 400 },
          details: {},
        },
      });

      const result = await svc.create({ name: '' });
      expect(result.error).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/products/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 5, regular_price: '15.00' },
        error: undefined,
      });

      const result = await svc.update(5, { regular_price: '15.00' });

      expect(doPutMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/products/5');
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/products/{id} with force param', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 5 }, error: undefined });

      await svc.delete(5, true);

      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products/5');
      expect(url).toContain('force=true');
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/products/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [5] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/batch'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('duplicate()', () => {
    it('POSTs to /wc/v3/products/{id}/duplicate', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 100, name: 'Shirt Copy' },
        error: undefined,
      });

      const result = await svc.duplicate(42);

      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/42/duplicate'
      );
      expect(result.data).toBeDefined();
    });
  });

  // ── Variations ─────────────────────────────────────────────────────────────

  describe('listVariations()', () => {
    it('returns a PaginatedRequest with productId in URL', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductService(state, config, events).listVariations(10)
          .then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products/{productId}/variations', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      await svc.listVariations(10, { per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products/10/variations');
    });
  });

  describe('getVariation()', () => {
    it('calls GET /wc/v3/products/{productId}/variations/{variationId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 20, sku: 'VAR-20' },
        error: undefined,
      });

      const result = await svc.getVariation(10, 20);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/10/variations/20'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('createVariation()', () => {
    it('POSTs to /wc/v3/products/{productId}/variations', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 21, sku: 'NEW-VAR' },
        error: undefined,
      });

      const result = await svc.createVariation(10, { regular_price: '20.00' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/10/variations'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('updateVariation()', () => {
    it('PUTs to /wc/v3/products/{productId}/variations/{variationId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 20, regular_price: '25.00' },
        error: undefined,
      });

      const result = await svc.updateVariation(10, 20, {
        regular_price: '25.00',
      });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/10/variations/20'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteVariation()', () => {
    it('DELETEs /wc/v3/products/{productId}/variations/{variationId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({
        data: { id: 20 },
        error: undefined,
      });

      await svc.deleteVariation(10, 20, true);

      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products/10/variations/20');
      expect(url).toContain('force=true');
    });
  });

  describe('generateVariations()', () => {
    it('POSTs to /wc/v3/products/{productId}/variations/generate', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { count: 3 },
        error: undefined,
      });

      const result = await svc.generateVariations(10);

      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/10/variations/generate'
      );
      expect(result.data?.count).toBe(3);
    });
  });

  describe('listCustomFieldNames()', () => {
    it('calls GET /wc/v3/products/custom-fields/names', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: ['field1', 'field2'],
        error: undefined,
      });

      const result = await svc.listCustomFieldNames();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/custom-fields/names'
      );
      expect(result.data).toBeDefined();
    });
  });
});

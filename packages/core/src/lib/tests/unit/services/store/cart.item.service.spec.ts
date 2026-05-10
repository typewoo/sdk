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
import { CartItemService } from '../../../../services/store/cart.item.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('CartItemService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('calls GET /wc/store/v1/cart/items and returns ApiPaginationResult directly', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/items'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('single()', () => {
    it('calls GET /wc/store/v1/cart/items/{key}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { key: 'abc', quantity: 1 },
        error: undefined,
      });

      const result = await svc.single('abc');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/items/abc'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('add()', () => {
    it('POSTs to /wc/store/v1/cart/items with product params in query', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { key: 'xyz', quantity: 2 },
        error: undefined,
      });

      const result = await svc.add({ id: 1, quantity: 2 });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/items'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when add fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_product_not_purchasable',
          message: 'Not purchasable',
          data: { status: 400 },
          details: {},
        },
      });

      const result = await svc.add({ id: 99, quantity: 1 });
      expect(result.error).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/store/v1/cart/items/{key} with quantity', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { key: 'abc', quantity: 5 },
        error: undefined,
      });

      const result = await svc.update('abc', 5);
      const url = doPutMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/items/abc');
      expect(url).toContain('quantity=5');
      expect(result.data).toBeDefined();
    });
  });

  describe('remove()', () => {
    it('DELETEs /wc/store/v1/cart/items/{key}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: undefined, error: undefined });

      await svc.remove('abc');
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/items/abc'
      );
    });
  });

  describe('clear()', () => {
    it('DELETEs /wc/store/v1/cart/items to clear all', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartItemService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: [], error: undefined });

      const result = await svc.clear();
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/items'
      );
      expect(result.data).toBeDefined();
    });
  });
});

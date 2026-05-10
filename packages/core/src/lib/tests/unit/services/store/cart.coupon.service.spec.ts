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
    .mockReturnValue({ total: 2, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doDelete } from '../../../../http/http.js';
import { CartCouponService } from '../../../../services/store/cart.coupon.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doDeleteMock = vi.mocked(doDelete);

describe('CartCouponService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('calls GET /wc/store/v1/cart/coupons and returns ApiPaginationResult directly', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartCouponService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/coupons'
      );
      expect(result.pagination).toBeDefined();
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartCouponService(state, config, events);
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
    it('calls GET /wc/store/v1/cart/coupons/{code}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartCouponService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { code: 'SAVE10' },
        error: undefined,
      });

      const result = await svc.single('SAVE10');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/coupons/SAVE10'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('add()', () => {
    it('POSTs to /wc/store/v1/cart/coupons?code={code}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartCouponService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { code: 'SAVE10' },
        error: undefined,
      });

      const result = await svc.add('SAVE10');
      const url = doPostMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/coupons');
      expect(url).toContain('code=SAVE10');
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/store/v1/cart/coupons/{code}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartCouponService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: undefined, error: undefined });

      await svc.delete('SAVE10');
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/coupons/SAVE10'
      );
    });
  });

  describe('clear()', () => {
    it('DELETEs /wc/store/v1/cart/coupons to remove all', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartCouponService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: [], error: undefined });

      const result = await svc.clear();
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/coupons'
      );
      expect(result.data).toBeDefined();
    });
  });
});

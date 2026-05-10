import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({
  doGet: vi.fn(),
  doPost: vi.fn(),
  doPut: vi.fn(),
  doDelete: vi.fn(),
}));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi.fn(),
}));

import { doGet, doPost } from '../../../../http/http.js';
import { CartService } from '../../../../services/store/cart.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);

describe('CartService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('get()', () => {
    it('calls GET /wc/store/v1/cart', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { items: [] },
        error: undefined,
      });

      const result = await svc.get();
      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/store/v1/cart');
      expect(result.data).toBeDefined();
    });

    it('returns error when cart request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.get();
      expect(result.error).toBeDefined();
    });
  });

  describe('add()', () => {
    it('POSTs to /wc/store/v1/cart/add-item with product params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { items: [{ id: 1 }] },
        error: undefined,
      });

      const result = await svc.add({ id: 42, quantity: 2 });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/add-item'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when add fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_product_not_purchasable',
          message: 'Not purchasable',
          data: { status: 400 },
          details: {},
        },
      });

      const result = await svc.add({ id: 42, quantity: 1 });
      expect(result.error).toBeDefined();
    });
  });

  describe('update()', () => {
    it('POSTs to /wc/store/v1/cart/update-item with key and quantity', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { items: [] },
        error: undefined,
      });

      const result = await svc.update('abc123', 3);
      const url = doPostMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/update-item');
      expect(url).toContain('key=abc123');
      expect(url).toContain('quantity=3');
      expect(result.data).toBeDefined();
    });
  });

  describe('remove()', () => {
    it('POSTs to /wc/store/v1/cart/remove-item with key', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { items: [] },
        error: undefined,
      });

      await svc.remove('abc123');
      const url = doPostMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/remove-item');
      expect(url).toContain('key=abc123');
    });
  });

  describe('applyCoupon()', () => {
    it('POSTs to /wc/store/v1/cart/apply-coupon with code', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { coupons: [{ code: 'SAVE10' }] },
        error: undefined,
      });

      const result = await svc.applyCoupon('SAVE10');
      const url = doPostMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/apply-coupon');
      expect(url).toContain('code=SAVE10');
      expect(result.data).toBeDefined();
    });

    it('returns error for invalid coupon', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_cart_coupon_error',
          message: 'Invalid coupon',
          data: { status: 400 },
          details: {},
        },
      });

      const result = await svc.applyCoupon('INVALID');
      expect(result.error).toBeDefined();
    });
  });

  describe('removeCoupon()', () => {
    it('POSTs to /wc/store/v1/cart/remove-coupon with code', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { coupons: [] },
        error: undefined,
      });

      await svc.removeCoupon('SAVE10');
      const url = doPostMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/remove-coupon');
      expect(url).toContain('code=SAVE10');
    });
  });

  describe('updateCustomer()', () => {
    it('POSTs to /wc/store/v1/cart/update-customer with body', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { customer: {} },
        error: undefined,
      });

      const result = await svc.updateCustomer({
        billing_address: { first_name: 'John' } as never,
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/update-customer'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('selectShippingRate()', () => {
    it('POSTs to /wc/store/v1/cart/select-shipping-rate with packageId and rateId', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { shipping_rates: [] },
        error: undefined,
      });

      const result = await svc.selectShippingRate(0, 'flat_rate:1');
      const url = doPostMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/cart/select-shipping-rate');
      expect(url).toContain('package_id=0');
      expect(url).toContain('rate_id=flat_rate');
      expect(result.data).toBeDefined();
    });
  });
});

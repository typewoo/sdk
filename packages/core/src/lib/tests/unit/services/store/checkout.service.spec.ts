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

import { doGet, doPost, doPut } from '../../../../http/http.js';
import { CheckoutService } from '../../../../services/store/checkout.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);

describe('CheckoutService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('get()', () => {
    it('calls GET /wc/store/v1/checkout/', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { order_id: 1 },
        error: undefined,
      });

      const result = await svc.get();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/checkout'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when get fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutService(state, config, events);
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

  describe('update()', () => {
    it('PUTs to /wc/store/v1/checkout with params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { order_id: 1 },
        error: undefined,
      });

      const result = await svc.update({
        billing_address: { first_name: 'Alice' } as never,
      });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/checkout'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('processOrderAndPayment()', () => {
    it('POSTs to /wc/store/v1/checkout with payment payload', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { status: 'processing', order_id: 100 },
        error: undefined,
      });

      const result = await svc.processOrderAndPayment({
        payment_method: 'bacs',
        billing_address: {} as never,
        shipping_address: {} as never,
        customer_note: '',
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/checkout'
      );
      expect(result.data?.status).toBe('processing');
    });

    it('returns error when payment fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_checkout_invalid_payment_method',
          message: 'Invalid payment method',
          data: { status: 402 },
          details: {},
        },
      });

      const result = await svc.processOrderAndPayment({
        payment_method: 'invalid',
        billing_address: {} as never,
        shipping_address: {} as never,
        customer_note: '',
      });
      expect(result.error).toBeDefined();
    });
  });
});

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

import { doPost } from '../../../../http/http.js';
import { CheckoutOrderService } from '../../../../services/store/checkout.order.service.js';

const doPostMock = vi.mocked(doPost);

describe('CheckoutOrderService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('order()', () => {
    it('POSTs to /wc/store/v1/checkout/{orderId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { status: 'processing', order_id: 55 },
        error: undefined,
      });

      const result = await svc.order(55, {
        payment_method: 'bacs',
        billing_address: {} as never,
        shipping_address: {} as never,
        customer_note: '',
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/checkout/55'
      );
      expect(result.data?.order_id).toBe(55);
    });

    it('returns error when order processing fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CheckoutOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_checkout_order_not_found',
          message: 'Order not found',
          data: { status: 404 },
          details: {},
        },
      });

      const result = await svc.order(999, {
        payment_method: 'bacs',
        billing_address: {} as never,
        shipping_address: {} as never,
        customer_note: '',
      });
      expect(result.error).toBeDefined();
    });
  });
});

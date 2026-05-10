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

import { doGet } from '../../../../http/http.js';
import { OrderService } from '../../../../services/store/order.service.js';

const doGetMock = vi.mocked(doGet);

describe('OrderService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('get()', () => {
    it('calls GET /wc/store/v1/order/{orderId} with key', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new OrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 100, status: 'processing' },
        error: undefined,
      });

      const result = await svc.get('wc_order_abc', '100');
      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/store/v1/order/100');
      expect(url).toContain('key=wc_order_abc');
      expect(result.data).toBeDefined();
    });

    it('appends billing_email when provided', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new OrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: { id: 100 }, error: undefined });

      await svc.get('wc_order_abc', '100', 'test@example.com');
      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('billing_email=test@example.com');
    });

    it('returns error when order not found', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new OrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'woocommerce_rest_order_invalid_key',
          message: 'Invalid key',
          data: { status: 401 },
          details: {},
        },
      });

      const result = await svc.get('bad_key', '999');
      expect(result.error).toBeDefined();
    });
  });
});

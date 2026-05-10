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
    .mockReturnValue({ total: 5, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminPaymentGatewayService } from '../../../../services/admin/payment-gateway.service.js';

const doGetMock = vi.mocked(doGet);
const doPutMock = vi.mocked(doPut);

describe('AdminPaymentGatewayService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminPaymentGatewayService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/payment_gateways', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminPaymentGatewayService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/payment_gateways'
      );
      expect(result.pagination?.total).toBe(5);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminPaymentGatewayService(state, config, events);
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

  describe('get()', () => {
    it('calls GET /wc/v3/payment_gateways/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminPaymentGatewayService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 'stripe', title: 'Stripe' },
        error: undefined,
      });

      const result = await svc.get('stripe');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/payment_gateways/stripe'
      );
      expect(result.data?.id).toBe('stripe');
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/payment_gateways/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminPaymentGatewayService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 'stripe', enabled: false },
        error: undefined,
      });

      const result = await svc.update('stripe', { enabled: false });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/payment_gateways/stripe'
      );
      expect(result.data?.enabled).toBe(false);
    });
  });
});

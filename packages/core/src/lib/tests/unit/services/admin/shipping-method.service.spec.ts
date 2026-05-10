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
    .mockReturnValue({ total: 8, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { AdminShippingMethodService } from '../../../../services/admin/shipping-method.service.js';

const doGetMock = vi.mocked(doGet);

describe('AdminShippingMethodService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminShippingMethodService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/shipping_methods', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingMethodService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping_methods'
      );
      expect(result.pagination?.total).toBe(8);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingMethodService(state, config, events);
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
    it('calls GET /wc/v3/shipping_methods/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingMethodService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 'flat_rate', method_title: 'Flat Rate' },
        error: undefined,
      });

      const result = await svc.get('flat_rate');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping_methods/flat_rate'
      );
      expect(result.data?.id).toBe('flat_rate');
    });
  });
});

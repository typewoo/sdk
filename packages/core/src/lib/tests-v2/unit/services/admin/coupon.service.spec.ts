import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({
  doGet: vi.fn(),
  doPost: vi.fn(),
  doPut: vi.fn(),
  doDelete: vi.fn(),
}));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi.fn().mockReturnValue({
    total: 10,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
  }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminCouponService } from '../../../../services/admin/coupon.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminCouponService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest (has .then and .loop)', () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      const req = svc.list();
      expect(typeof req.then).toBe('function');
      expect(typeof req.loop).toBe('function');
    });

    it('awaiting list calls GET /wc/v3/coupons', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/coupons');
      expect(url).toContain('per_page=5');
      expect(result.pagination).toBeDefined();
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      const mockError = {
        code: 'rest_forbidden',
        message: 'Forbidden',
        data: { status: 403 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: mockError,
        headers: {},
      });

      const result = await svc.list();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/coupons/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 42, code: 'TEST10' },
        error: undefined,
      });

      const result = await svc.get(42);

      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/coupons/42');
      expect(result.data).toBeDefined();
    });

    it('returns error when not found', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      const mockError = {
        code: 'woocommerce_rest_coupon_invalid_id',
        message: 'Not found',
        data: { status: 404 },
        details: {},
      };
      doGetMock.mockResolvedValueOnce({ data: undefined, error: mockError });

      const result = await svc.get(999);
      expect(result.error?.code).toBe('woocommerce_rest_coupon_invalid_id');
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/coupons with coupon body', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 1, code: 'NEWCOUPON' },
        error: undefined,
      });

      const result = await svc.create({
        code: 'NEWCOUPON',
        discount_type: 'percent',
        amount: '10',
      });

      expect(doPostMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/coupons');
      expect(doPostMock.mock.calls[0][0]).not.toContain('/batch');
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/coupons/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 5, code: 'UPDATED' },
        error: undefined,
      });

      const result = await svc.update(5, { amount: '20' });

      expect(doPutMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/coupons/5');
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/coupons/{id} with force param', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 5 }, error: undefined });

      await svc.delete(5, true);

      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/coupons/5');
      expect(url).toContain('force=true');
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/coupons/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCouponService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({
        create: [{ code: 'BATCH1', discount_type: 'percent', amount: '5' }],
      });

      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/coupons/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

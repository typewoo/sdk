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
    total: 20,
    totalPages: 2,
    currentPage: 1,
    perPage: 10,
  }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminCustomerService } from '../../../../services/admin/customer.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminCustomerService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      const req = svc.list();
      expect(typeof req.then).toBe('function');
      expect(typeof req.loop).toBe('function');
    });

    it('awaiting list calls GET /wc/v3/customers with params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 10, role: 'customer' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/customers');
      expect(url).toContain('per_page=10');
      expect(result.pagination?.total).toBe(20);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
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
    it('calls GET /wc/v3/customers/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 7, email: 'a@b.com' },
        error: undefined,
      });

      const result = await svc.get(7);

      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/customers/7'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/customers', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 1, email: 'new@c.com' },
        error: undefined,
      });

      const result = await svc.create({
        email: 'new@c.com',
        username: 'newuser',
        password: 'secret',
      });

      expect(doPostMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/customers');
      expect(doPostMock.mock.calls[0][0]).not.toContain('/batch');
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/customers/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 3, email: 'upd@c.com' },
        error: undefined,
      });

      const result = await svc.update(3, { first_name: 'Updated' });

      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/customers/3'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/customers/{id} with force and reassign params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 3 }, error: undefined });

      await svc.delete(3, true, 1);

      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/customers/3');
      expect(url).toContain('force=true');
      expect(url).toContain('reassign=1');
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/customers/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminCustomerService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [1, 2] });

      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/customers/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

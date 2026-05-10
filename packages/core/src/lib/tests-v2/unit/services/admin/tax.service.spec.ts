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
import {
  AdminTaxService,
  AdminTaxClassService,
} from '../../../../services/admin/tax.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminTaxService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest for /wc/v3/taxes', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminTaxService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/taxes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 5 });
      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/taxes');
      expect(result.pagination).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/taxes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 1, rate: '10' },
        error: undefined,
      });

      const result = await svc.get(1);
      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/taxes/1');
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/taxes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 2, rate: '5' },
        error: undefined,
      });

      const result = await svc.create({
        rate: '5',
        name: 'State Tax',
        compound: false,
      });
      expect(doPostMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/taxes');
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/taxes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 1, rate: '12' },
        error: undefined,
      });

      const result = await svc.update(1, { rate: '12' });
      expect(doPutMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/taxes/1');
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/taxes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 1 }, error: undefined });

      await svc.delete(1, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/taxes/1');
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/taxes/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [1] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/taxes/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

describe('AdminTaxClassService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('calls GET /wc/v3/taxes/classes (returns ApiResult, not paginated)', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxClassService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ slug: 'standard', name: 'Standard Rate' }],
        error: undefined,
      });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/taxes/classes'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxClassService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.list();
      expect(result.error).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/taxes/classes/{slug}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxClassService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ slug: 'reduced-rate', name: 'Reduced Rate' }],
        error: undefined,
      });

      const result = await svc.get('reduced-rate');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/taxes/classes/reduced-rate'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/taxes/classes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminTaxClassService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { slug: 'new-rate', name: 'New Rate' },
        error: undefined,
      });

      const result = await svc.create({ name: 'New Rate' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/taxes/classes'
      );
      expect(result.data).toBeDefined();
    });
  });
});

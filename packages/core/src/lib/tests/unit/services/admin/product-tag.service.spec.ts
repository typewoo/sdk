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
    .mockReturnValue({ total: 12, totalPages: 2, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductTagService } from '../../../../services/admin/product-tag.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminProductTagService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductTagService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products/tags', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 10 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/products/tags');
      expect(url).toContain('per_page=10');
      expect(result.pagination?.total).toBe(12);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'err',
          message: 'x',
          data: { status: 500 },
          details: {},
        },
        headers: {},
      });
      const result = await svc.list();
      expect(result.error).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/products/tags/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 5, name: 'sale' },
        error: undefined,
      });

      const result = await svc.get(5);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/tags/5'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/products/tags', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 6, name: 'new-tag' },
        error: undefined,
      });

      const result = await svc.create({ name: 'new-tag' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/tags'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/products/tags/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 5, name: 'updated-tag' },
        error: undefined,
      });

      const result = await svc.update(5, { name: 'updated-tag' });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/tags/5'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/products/tags/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 5 }, error: undefined });

      await svc.delete(5, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/tags/5'
      );
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/products/tags/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductTagService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [5] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/tags/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

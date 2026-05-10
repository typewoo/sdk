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
    .mockReturnValue({ total: 4, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductAttributeService } from '../../../../services/admin/product-attribute.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminProductAttributeService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductAttributeService(state, config, events).list()
          .then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products/attributes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/attributes'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/products/attributes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 1, name: 'Color' },
        error: undefined,
      });

      const result = await svc.get(1);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/attributes/1'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/products/attributes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 2, name: 'Size' },
        error: undefined,
      });

      const result = await svc.create({ name: 'Size' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/attributes'
      );
      expect(doPostMock.mock.calls[0][0]).not.toContain('/batch');
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/products/attributes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 1, name: 'Updated Color' },
        error: undefined,
      });

      const result = await svc.update(1, { name: 'Updated Color' });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/attributes/1'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/products/attributes/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 1 }, error: undefined });

      await svc.delete(1, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/attributes/1'
      );
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/products/attributes/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [1] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/attributes/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

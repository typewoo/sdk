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
    .mockReturnValue({ total: 3, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductAttributeTermService } from '../../../../services/admin/product-attribute-term.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

const ATTR_ID = 1;

describe('AdminProductAttributeTermService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductAttributeTermService(state, config, events).list(
          ATTR_ID
        ).then
      ).toBe('function');
    });

    it('calls GET with attributeId in URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeTermService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list(ATTR_ID, { per_page: 10 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain(
        `/wp-json/wc/v3/products/attributes/${ATTR_ID}/terms`
      );
      expect(url).toContain('per_page=10');
      expect(result.pagination).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/products/attributes/{attributeId}/terms/{termId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeTermService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 5, name: 'Red' },
        error: undefined,
      });

      const result = await svc.get(ATTR_ID, 5);

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain(
        `/wp-json/wc/v3/products/attributes/${ATTR_ID}/terms/5`
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs with attributeId in URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeTermService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 6, name: 'Blue' },
        error: undefined,
      });

      const result = await svc.create(ATTR_ID, { name: 'Blue' });

      expect(doPostMock.mock.calls[0][0]).toContain(
        `/wp-json/wc/v3/products/attributes/${ATTR_ID}/terms`
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs with attributeId and termId in URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeTermService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 5, name: 'Crimson' },
        error: undefined,
      });

      const result = await svc.update(ATTR_ID, 5, { name: 'Crimson' });

      expect(doPutMock.mock.calls[0][0]).toContain(
        `/wp-json/wc/v3/products/attributes/${ATTR_ID}/terms/5`
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs with attributeId and termId in URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeTermService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 5 }, error: undefined });

      await svc.delete(ATTR_ID, 5, true);

      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain(
        `/wp-json/wc/v3/products/attributes/${ATTR_ID}/terms/5`
      );
      expect(url).toContain('force=true');
    });
  });

  describe('batch()', () => {
    it('POSTs to terms/batch with attributeId in URL', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductAttributeTermService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch(ATTR_ID, { delete: [5] });

      expect(doPostMock.mock.calls[0][0]).toContain(
        `/wp-json/wc/v3/products/attributes/${ATTR_ID}/terms/batch`
      );
      expect(result.data).toBeDefined();
    });
  });
});

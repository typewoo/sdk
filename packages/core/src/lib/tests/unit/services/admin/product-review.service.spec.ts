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
    .mockReturnValue({ total: 15, totalPages: 2, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminProductReviewService } from '../../../../services/admin/product-review.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminProductReviewService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminProductReviewService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/products/reviews', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 10 });
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/reviews'
      );
      expect(result.pagination?.total).toBe(15);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
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
    it('calls GET /wc/v3/products/reviews/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 8, review: 'Great!' },
        error: undefined,
      });

      const result = await svc.get(8);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/reviews/8'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/products/reviews', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 9, review: 'Nice!' },
        error: undefined,
      });

      const result = await svc.create({
        product_id: 1,
        review: 'Nice!',
        reviewer: 'Tom',
        reviewer_email: 't@t.com',
        rating: 5,
        status: 'approved',
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/reviews'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/products/reviews/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 8, review: 'Updated!' },
        error: undefined,
      });

      const result = await svc.update(8, { review: 'Updated!' });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/reviews/8'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/products/reviews/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 8 }, error: undefined });

      await svc.delete(8, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/reviews/8'
      );
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/products/reviews/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminProductReviewService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [8] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/products/reviews/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

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
    total: 5,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
  }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminWebhookService } from '../../../../services/admin/webhook.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminWebhookService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      expect(typeof svc.list().then).toBe('function');
    });

    it('awaiting list calls GET /wc/v3/webhooks', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 5 });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/webhooks');
      expect(url).toContain('per_page=5');
      expect(result.pagination).toBeDefined();
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
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
    it('calls GET /wc/v3/webhooks/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 1, name: 'Test Hook' },
        error: undefined,
      });

      const result = await svc.get(1);

      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/webhooks/1');
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/webhooks', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 2, name: 'New Hook' },
        error: undefined,
      });

      const result = await svc.create({
        name: 'New Hook',
        topic: 'order.created',
        delivery_url: 'https://example.com/hook',
      });

      expect(doPostMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/webhooks');
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/webhooks/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 1, status: 'active' },
        error: undefined,
      });

      const result = await svc.update(1, { status: 'active' });

      expect(doPutMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/webhooks/1');
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/webhooks/{id} with force param', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 1 }, error: undefined });

      await svc.delete(1, true);

      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/webhooks/1');
      expect(url).toContain('force=true');
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/webhooks/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminWebhookService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [1] });

      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/webhooks/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

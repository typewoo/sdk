import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({
  doGet: vi.fn(),
  doPost: vi.fn(),
  doPut: vi.fn(),
  doDelete: vi.fn(),
}));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi.fn(),
}));

import { doPost } from '../../../../http/http.js';
import { BatchService } from '../../../../services/store/batch.service.js';

const doPostMock = vi.mocked(doPost);

describe('BatchService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('execute()', () => {
    it('POSTs to /wc/store/v1/batch with request body', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new BatchService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { responses: [] },
        error: undefined,
      });

      const result = await svc.execute({
        requests: [{ method: 'GET', path: '/wc/store/v1/cart' }],
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/batch'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when batch fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new BatchService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.execute({ requests: [] });
      expect(result.error).toBeDefined();
    });
  });
});

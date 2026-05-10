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
import { CartExtensionsService } from '../../../../services/store/cart.extensions.service.js';

const doPostMock = vi.mocked(doPost);

describe('CartExtensionsService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('store()', () => {
    it('POSTs to /wc/store/v1/cart/extensions', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartExtensionsService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { namespace: 'my-plugin', data: {} },
        error: undefined,
      });

      const result = await svc.store({ namespace: 'my-plugin', data: {} });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/cart/extensions'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when store fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new CartExtensionsService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.store({ namespace: 'my-plugin', data: {} });
      expect(result.error).toBeDefined();
    });
  });
});

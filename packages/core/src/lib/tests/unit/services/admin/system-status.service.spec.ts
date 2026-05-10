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

import { doGet } from '../../../../http/http.js';
import { AdminSystemStatusService } from '../../../../services/admin/system-status.service.js';

const doGetMock = vi.mocked(doGet);

describe('AdminSystemStatusService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('get()', () => {
    it('calls GET /wc/v3/system_status', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSystemStatusService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { environment: { wp_version: '6.0' } },
        error: undefined,
      });

      const result = await svc.get();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/system_status'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSystemStatusService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.get();
      expect(result.error).toBeDefined();
    });
  });
});

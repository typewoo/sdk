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

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminSettingService } from '../../../../services/admin/setting.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);

describe('AdminSettingService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('listGroups()', () => {
    it('calls GET /wc/v3/settings and returns ApiResult directly', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'general', label: 'General' }],
        error: undefined,
      });

      const result = await svc.listGroups();
      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/settings');
      expect(result.data).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.listGroups();
      expect(result.error).toBeDefined();
    });
  });

  describe('listSettings()', () => {
    it('calls GET /wc/v3/settings/{groupId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'woocommerce_store_address' }],
        error: undefined,
      });

      const result = await svc.listSettings('general');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/settings/general'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getSetting()', () => {
    it('calls GET /wc/v3/settings/{groupId}/{settingId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 'woocommerce_store_address', value: '123 Main St' },
        error: undefined,
      });

      const result = await svc.getSetting(
        'general',
        'woocommerce_store_address'
      );
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/settings/general/woocommerce_store_address'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('updateSetting()', () => {
    it('PUTs to /wc/v3/settings/{groupId}/{settingId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 'woocommerce_store_address', value: '456 New St' },
        error: undefined,
      });

      const result = await svc.updateSetting(
        'general',
        'woocommerce_store_address',
        { value: '456 New St' }
      );
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/settings/general/woocommerce_store_address'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('batchUpdateSettings()', () => {
    it('POSTs to /wc/v3/settings/{groupId}/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { update: [] },
        error: undefined,
      });

      const result = await svc.batchUpdateSettings('general', {
        update: [{ id: 'woocommerce_store_address', value: '789 Batch St' }],
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/settings/general/batch'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('batchUpdate()', () => {
    it('POSTs to /wc/v3/settings/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminSettingService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { update: [] },
        error: undefined,
      });

      const result = await svc.batchUpdate({ update: [] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/settings/batch'
      );
      expect(result.data).toBeDefined();
    });
  });
});

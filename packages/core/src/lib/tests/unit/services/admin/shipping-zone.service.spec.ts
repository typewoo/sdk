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
import { AdminShippingZoneService } from '../../../../services/admin/shipping-zone.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminShippingZoneService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Zone CRUD ──────────────────────────────────────────────────────────────

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminShippingZoneService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/shipping/zones', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones'
      );
      expect(result.pagination?.total).toBe(3);
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/shipping/zones/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 1, name: 'US' },
        error: undefined,
      });

      const result = await svc.get(1);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/shipping/zones', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 2, name: 'EU' },
        error: undefined,
      });

      const result = await svc.create({ name: 'EU' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/shipping/zones/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 1, name: 'USA' },
        error: undefined,
      });

      const result = await svc.update(1, { name: 'USA' });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/shipping/zones/{id} with ?force=true', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 1 }, error: undefined });

      await svc.delete(1, true);
      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/shipping/zones/1');
      expect(url).toContain('force=true');
    });
  });

  // ── Locations ──────────────────────────────────────────────────────────────

  describe('listLocations()', () => {
    it('calls GET /wc/v3/shipping/zones/{zoneId}/locations', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ code: 'US', type: 'country' }],
        error: undefined,
      });

      const result = await svc.listLocations(1);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1/locations'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('updateLocations()', () => {
    it('PUTs to /wc/v3/shipping/zones/{zoneId}/locations', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: [{ code: 'US', type: 'country' }],
        error: undefined,
      });

      const result = await svc.updateLocations(1, [
        { code: 'US', type: 'country' },
      ]);
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1/locations'
      );
      expect(result.data).toBeDefined();
    });
  });

  // ── Methods ────────────────────────────────────────────────────────────────

  describe('listMethods()', () => {
    it('calls GET /wc/v3/shipping/zones/{zoneId}/methods (returns ApiPaginationResult directly)', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.listMethods(1);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1/methods'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getMethod()', () => {
    it('calls GET /wc/v3/shipping/zones/{zoneId}/methods/{instanceId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { instance_id: 3, method_id: 'flat_rate' },
        error: undefined,
      });

      const result = await svc.getMethod(1, 3);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1/methods/3'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('addMethod()', () => {
    it('POSTs to /wc/v3/shipping/zones/{zoneId}/methods', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { instance_id: 4, method_id: 'flat_rate' },
        error: undefined,
      });

      const result = await svc.addMethod(1, 'flat_rate');
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1/methods'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('updateMethod()', () => {
    it('PUTs to /wc/v3/shipping/zones/{zoneId}/methods/{instanceId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { instance_id: 4, enabled: false },
        error: undefined,
      });

      const result = await svc.updateMethod(1, 4, { enabled: false });
      expect(doPutMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/shipping/zones/1/methods/4'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteMethod()', () => {
    it('DELETEs /wc/v3/shipping/zones/{zoneId}/methods/{instanceId} with ?force=true', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminShippingZoneService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({
        data: { instance_id: 4 },
        error: undefined,
      });

      await svc.deleteMethod(1, 4, true);
      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/shipping/zones/1/methods/4');
      expect(url).toContain('force=true');
    });
  });
});

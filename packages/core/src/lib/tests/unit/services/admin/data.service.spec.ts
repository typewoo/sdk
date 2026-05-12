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
    .mockReturnValue({ total: 6, totalPages: 1, currentPage: 1, perPage: 10 }),
}));

import { doGet } from '../../../../http/http.js';
import { AdminDataService } from '../../../../services/admin/data.service.js';

const doGetMock = vi.mocked(doGet);

describe('AdminDataService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('listCountries()', () => {
    it('calls GET /wc/v3/data/countries and returns ApiPaginationResult directly', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.listCountries();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/data/countries'
      );
      expect(result.pagination).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
        headers: {},
      });

      const result = await svc.listCountries();
      expect(result.error).toBeDefined();
    });
  });

  describe('getCountry()', () => {
    it('calls GET /wc/v3/data/countries/{code}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { code: 'US', name: 'United States' },
        error: undefined,
      });

      const result = await svc.getCountry('US');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/data/countries/US'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('listCurrencies()', () => {
    it('calls GET /wc/v3/data/currencies', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.listCurrencies();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/data/currencies'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getCurrency()', () => {
    it('calls GET /wc/v3/data/currencies/{code}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { code: 'USD', name: 'US Dollar' },
        error: undefined,
      });

      const result = await svc.getCurrency('USD');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/data/currencies/USD'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('listContinents()', () => {
    it('calls GET /wc/v3/data/continents', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [],
        headers: {},
        error: undefined,
      });

      const result = await svc.listContinents();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/data/continents'
      );
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getContinent()', () => {
    it('calls GET /wc/v3/data/continents/{code}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { code: 'NA', name: 'North America' },
        error: undefined,
      });

      const result = await svc.getContinent('NA');
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/data/continents/NA'
      );
      expect(result.data).toBeDefined();
    });
  });
});

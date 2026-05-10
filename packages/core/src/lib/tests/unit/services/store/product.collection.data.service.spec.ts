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
import { ProductCollectionDataService } from '../../../../services/store/product.collection.data.service.js';

const doGetMock = vi.mocked(doGet);

describe('ProductCollectionDataService (store)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('calculate()', () => {
    it('calls GET /wc/store/v1/products/collection-data', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductCollectionDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { price_range: { min_price: '5.00', max_price: '100.00' } },
        error: undefined,
      });

      const result = await svc.calculate({ calculate_price_range: true });
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/store/v1/products/collection-data'
      );
      expect(result.data).toBeDefined();
    });

    it('returns error when request fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new ProductCollectionDataService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.calculate();
      expect(result.error).toBeDefined();
    });
  });
});

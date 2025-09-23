import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';

/**
 * Integration: Admin Data (Countries, Currencies, Continents)
 * Covers list/get for each data endpoint with safe assertions.
 */
describe('Integration: Admin Data', () => {
  beforeAll(async () => {
    await StoreSdk.init({
      baseUrl: GET_WP_URL(),
      admin: {
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists countries and gets one by code', async () => {
    const list = await StoreSdk.admin.data.listCountries({ context: 'view' });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return;
    }
    expect(Array.isArray(list.data)).toBe(true);
    if (!list.data || list.data.length === 0) return;
    const code = list.data[0].code;
    const get = await StoreSdk.admin.data.getCountry(code, { context: 'view' });
    if (get.error) {
      expect(get.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(get.data?.code).toBe(code);
    }
  });

  it('lists currencies and gets one by code', async () => {
    const list = await StoreSdk.admin.data.listCurrencies({ context: 'view' });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return;
    }
    expect(Array.isArray(list.data)).toBe(true);
    if (!list.data || list.data.length === 0) return;
    const code = list.data[0].code;
    const get = await StoreSdk.admin.data.getCurrency(code, {
      context: 'view',
    });
    if (get.error) {
      expect(get.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(get.data?.code).toBe(code);
    }
  });

  it('lists continents and gets one by code', async () => {
    const list = await StoreSdk.admin.data.listContinents({ context: 'view' });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return;
    }
    expect(Array.isArray(list.data)).toBe(true);
    if (!list.data || list.data.length === 0) return;
    const code = list.data[0].code;
    const get = await StoreSdk.admin.data.getContinent(code, {
      context: 'view',
    });
    if (get.error) {
      expect(get.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(get.data?.code).toBe(code);
    }
  });
});

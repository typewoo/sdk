import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration tests for Admin Product Custom Fields
 * Covers: list custom-field names with optional filters.
 */
describe('Integration: Admin Product Custom Fields', () => {
  beforeAll(async () => {
    await Typewoo.init({
      baseUrl: GET_WP_URL(),
      admin: {
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists product custom-field names', async () => {
    const res = await Typewoo.admin.products.listCustomFieldNames();
    // Some stores may not have this feature enabled; accept error gracefully
    if (res.error) {
      expect(res.error.code).toMatch(/not_found|invalid|forbidden/i);
      return;
    }
    expect(Array.isArray(res.data)).toBe(true);
    // Try with a search filter (best-effort)
    const resSearch = await Typewoo.admin.products.listCustomFieldNames({
      search: 'color',
    });
    if (resSearch.error) {
      expect(resSearch.error.code).toMatch(/not_found|invalid|forbidden/i);
    } else {
      expect(Array.isArray(resSearch.data)).toBe(true);
    }
  });
});

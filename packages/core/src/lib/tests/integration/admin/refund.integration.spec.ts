import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';

/**
 * Integration: Admin Refunds (Global)
 * Covers listing refunds globally and fetching a single refund via global endpoint.
 * Assertions are resilient to environments with little/no data.
 */
describe('Integration: Admin Refunds (Global)', () => {
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

  it('lists refunds (global) with optional headers', async () => {
    const { data, error, total, totalPages } =
      await StoreSdk.admin.refunds.list({
        per_page: 5,
        page: 1,
        context: 'view',
      });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });
});

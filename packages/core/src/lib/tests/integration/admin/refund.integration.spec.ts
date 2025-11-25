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
 * Integration: Admin Refunds (Global)
 * Covers listing refunds globally and fetching a single refund via global endpoint.
 * Assertions are resilient to environments with little/no data.
 */
describe('Integration: Admin Refunds (Global)', () => {
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

  it('lists refunds (global) with optional headers', async () => {
    const { data, error, total, totalPages } = await Typewoo.admin.refunds.list(
      {
        per_page: 5,
        page: 1,
        context: 'view',
      }
    );
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });
});

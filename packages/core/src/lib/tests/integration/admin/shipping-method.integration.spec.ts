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
 * Integration: Admin Shipping Methods
 * Covers list and get for shipping methods service (read-only endpoints)
 */
describe('Integration: Admin Shipping Methods', () => {
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

  it('lists shipping methods', async () => {
    const { data, error } = await Typewoo.admin.shippingMethods.list();
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
  });

  it('gets a single shipping method by id (if available)', async () => {
    const list = await Typewoo.admin.shippingMethods.list();
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const getRes = await Typewoo.admin.shippingMethods.get(id);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(id);
  });

  it('handles shipping method error cases gracefully', async () => {
    const notFound = await Typewoo.admin.shippingMethods.get(
      'definitely-not-a-method',
    );
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(
      /not_found|invalid|forbidden|unsupported|rest_no_route/i,
    );
  });
});

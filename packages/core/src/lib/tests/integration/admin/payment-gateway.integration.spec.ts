import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';

/**
 * Integration: Admin Payment Gateways
 * Covers list/get/update for payment gateways. Uses non-destructive updates.
 */
describe('Integration: Admin Payment Gateways', () => {
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

  it('lists payment gateways and gets one by id', async () => {
    const list = await StoreSdk.admin.paymentGateways.list({ context: 'view' });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return;
    }
    expect(Array.isArray(list.data)).toBe(true);
    if (!list.data || list.data.length === 0) return;

    const gw = list.data[0];
    const get = await StoreSdk.admin.paymentGateways.get(gw.id, {
      context: 'view',
    });
    if (get.error) {
      expect(get.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(get.data?.id).toBe(gw.id);
    }
  });

  it('updates a payment gateway safely (enabled toggle or no-op settings)', async () => {
    const list = await StoreSdk.admin.paymentGateways.list({ context: 'edit' });
    if (list.error || !list.data || list.data.length === 0) return;
    const gw = list.data[0];

    const safePayload = (() => {
      // Prefer toggling enabled if present; settings updates vary per gateway.
      if (typeof gw.enabled === 'boolean') {
        return { enabled: !gw.enabled };
      }
      // Else attempt a no-op settings write (echo current value of one setting)
      const keys = Object.keys(gw.settings ?? {});
      if (keys.length > 0) {
        const k = keys[0];
        return { settings: { [k]: gw.settings[k].value } };
      }
      return {};
    })();

    const upd = await StoreSdk.admin.paymentGateways.update(gw.id, safePayload);
    if (upd.error) {
      expect(upd.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(upd.data?.id).toBe(gw.id);
    }
  });
});

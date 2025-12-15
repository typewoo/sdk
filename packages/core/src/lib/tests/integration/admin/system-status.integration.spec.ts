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
 * Integration: Admin System Status
 * Covers get() for system status with environment-agnostic assertions.
 */
describe('Integration: Admin System Status', () => {
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

  it('gets system status', async () => {
    const res = await Typewoo.admin.systemStatus.get({ context: 'view' });
    if (res.error) {
      expect(res.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i,
      );
    } else {
      expect(res.data).toBeTruthy();
      if (!res.data) return;
      expect(typeof res.data.environment?.php_version).toBe('string');
      expect(typeof res.data.settings?.currency).toBe('string');
    }
  });
});

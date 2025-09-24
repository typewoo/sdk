import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration: Admin Taxes (Rates & Classes)
 * Covers tax classes: list/create/get/delete
 * Covers tax rates: list/create/update/get/delete/batch
 * Assertions are environment-agnostic where features may be disabled.
 */
describe('Integration: Admin Taxes', () => {
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

  it('lists tax classes and can CRUD a custom class', async () => {
    // List classes
    const list = await StoreSdk.admin.taxClasses.list({ context: 'view' });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(Array.isArray(list.data)).toBe(true);
    }

    // Create class
    const name = `Integration Class ${Date.now()}`;
    const created = await StoreSdk.admin.taxClasses.create({ name });
    if (created.error) {
      expect(created.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return; // Environment may block writes
    }
    expect(created.data).toBeTruthy();
    if (!created.data) return;
    const slug = created.data.slug;
    // Get class
    const get = await StoreSdk.admin.taxClasses.get(slug);
    expect(get.data).toBeTruthy();
    expect(get.error).toBeFalsy();

    if (get.data) {
      expect(get.data[0].slug).toBe(slug);
    }

    // Delete class
    const del = await StoreSdk.admin.taxClasses.delete(slug, true);
    expect(del.error).toBeFalsy();
  });

  it('lists tax rates and can CRUD + batch', async () => {
    // List rates
    const list = await StoreSdk.admin.taxes.list({ per_page: 5, page: 1 });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(Array.isArray(list.data)).toBe(true);
    }

    // Create a tax rate (ensure valid minimal fields)
    const rateA = await StoreSdk.admin.taxes.create({
      country: 'US',
      state: '',
      rate: '5.0000',
      name: `INT-A-${Date.now()}`,
      shipping: true,
      class: 'standard',
      priority: 1,
    });
    if (rateA.error) {
      expect(rateA.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return; // Skip rest if environment disallows writes
    }
    expect(rateA.data).toBeTruthy();
    if (!rateA.data) return;
    const idA = rateA.data.id;

    try {
      // Update the tax rate
      const updated = await StoreSdk.admin.taxes.update(idA, {
        name: `${rateA.data.name}-UPD`,
        rate: '6.5000',
      });
      expect(updated.error).toBeFalsy();
      if (updated.data) {
        expect(updated.data.rate).toBe('6.5000');
      }

      // Get the tax rate
      const get = await StoreSdk.admin.taxes.get(idA);
      expect(get.error).toBeFalsy();
      expect(get.data?.id).toBe(idA);

      // Create a second rate for batch
      const rateB = await StoreSdk.admin.taxes.create({
        country: 'US',
        state: '',
        rate: '4.0000',
        name: `INT-B-${Date.now()}`,
        shipping: false,
        class: 'standard',
        priority: 2,
      });
      if (rateB.error) {
        expect(rateB.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i
        );
      } else if (rateB.data) {
        const idB = rateB.data.id;

        // Batch update/delete
        const batch = await StoreSdk.admin.taxes.batch({
          update: [{ id: idA, name: `${rateA.data.name}-BATCH` }],
          delete: [idB],
        });
        expect(batch.error).toBeFalsy();
      }
    } finally {
      // Cleanup created rateA
      await StoreSdk.admin.taxes.delete(idA, true);
    }
  });
});

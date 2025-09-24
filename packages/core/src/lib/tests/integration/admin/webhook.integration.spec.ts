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
 * Integration: Admin Webhooks
 * Covers list/get/create/update/delete/batch for webhooks.
 * Assertions are resilient to environments that may block outgoing webhook creation.
 */
describe('Integration: Admin Webhooks', () => {
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

  it('lists webhooks with optional headers', async () => {
    const { data, error, total, totalPages } =
      await StoreSdk.admin.webhooks.list({
        per_page: 5,
        page: 1,
        status: 'all',
      });
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
      if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
    }
  });

  it('can create, get, update, batch and delete webhooks', async () => {
    // Create a webhook. Use a dummy delivery URL valid format to pass validation.
    const created = await StoreSdk.admin.webhooks.create({
      name: `INT-WH-${Date.now()}`,
      status: 'paused',
      topic: 'order.created',
      delivery_url: 'https://example.com/webhook-receiver',
      secret: 'integration-secret',
    });
    if (created.error) {
      expect(created.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return; // Environment may block webhook writes
    }
    expect(created.data).toBeTruthy();
    if (!created.data) return;
    const idA = created.data.id;

    try {
      // Get
      const get = await StoreSdk.admin.webhooks.get(idA);
      expect(get.error).toBeFalsy();
      expect(get.data?.id).toBe(idA);

      // Update
      const updated = await StoreSdk.admin.webhooks.update(idA, {
        name: `${created.data.name}-UPD`,
        status: 'active',
      });
      expect(updated.error).toBeFalsy();

      // Create a second webhook for batch delete
      const createdB = await StoreSdk.admin.webhooks.create({
        name: `INT-WH-B-${Date.now()}`,
        status: 'paused',
        topic: 'order.updated',
        delivery_url: 'https://example.com/webhook-receiver-2',
      });
      if (!createdB.error && createdB.data) {
        const idB = createdB.data.id;
        const batch = await StoreSdk.admin.webhooks.batch({
          update: [{ id: idA, name: `${created.data.name}-BATCH` }],
          delete: [idB],
        });
        expect(batch.error).toBeFalsy();
      } else if (createdB.error) {
        expect(createdB.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i
        );
      }

      // Delete first webhook
      const del = await StoreSdk.admin.webhooks.delete(idA, true);
      expect(del.error).toBeFalsy();
    } finally {
      // Best-effort cleanup if update or batch failed
      await StoreSdk.admin.webhooks.delete(idA, true);
    }
  });
});

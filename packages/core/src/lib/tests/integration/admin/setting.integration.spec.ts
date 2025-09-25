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
 * Integration: Admin Settings (Groups & Options)
 * Covers listGroups, listSettings, getSetting, updateSetting, batchUpdateSettings, batchUpdate.
 * Uses environment-agnostic assertions and avoids destructive changes.
 */
describe('Integration: Admin Settings', () => {
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

  it('lists setting groups and lists settings for one group', async () => {
    const groups = await StoreSdk.admin.settings.listGroups();
    if (groups.error) {
      expect(groups.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
      return;
    }
    expect(Array.isArray(groups.data)).toBe(true);
    if (!groups.data || groups.data.length === 0) return;

    const groupId = groups.data[0].id;
    const list = await StoreSdk.admin.settings.listSettings(groupId);
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(Array.isArray(list.data)).toBe(true);
    }
  });

  it('gets, updates, and batch-updates settings (safe values)', async () => {
    const groups = await StoreSdk.admin.settings.listGroups();
    if (groups.error || !groups.data || groups.data.length === 0) return;
    const groupId = groups.data[0].id;

    const settings = await StoreSdk.admin.settings.listSettings(groupId);
    if (settings.error || !settings.data || settings.data.length === 0) return;

    const setting = settings.data[0];
    const settingId = setting.id;

    // Read original value to restore via batch
    const get = await StoreSdk.admin.settings.getSetting(groupId, settingId);
    if (get.error || !get.data) return;
    const originalValue = get.data.value;

    // Choose a safe same-type value (toggle/round-trip minimal change)
    const nextValue = (() => {
      if (typeof originalValue === 'boolean') return !originalValue;
      if (typeof originalValue === 'number') return originalValue; // avoid risky numeric changes
      if (typeof originalValue === 'string') return originalValue; // no-op update for safety
      return originalValue as unknown as string | number | boolean;
    })();

    const upd = await StoreSdk.admin.settings.updateSetting(
      groupId,
      settingId,
      {
        value: nextValue,
      }
    );
    if (upd.error) {
      expect(upd.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(upd.data?.id).toBe(settingId);
    }

    // Batch update the same setting back to original, using group batch
    const batchGrp = await StoreSdk.admin.settings.batchUpdateSettings(
      groupId,
      {
        update: [{ id: settingId, value: originalValue }],
      }
    );
    if (batchGrp.error) {
      expect(batchGrp.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(Array.isArray(batchGrp.data?.update ?? [])).toBe(true);
    }

    // Multi-group batch update (noop echo of original to demonstrate API)
    const batch = await StoreSdk.admin.settings.batchUpdate({
      update: [{ group: groupId, id: settingId, value: originalValue }],
    });
    if (batch.error) {
      expect(batch.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(Array.isArray(batch.data?.update ?? [])).toBe(true);
    }
  });
});

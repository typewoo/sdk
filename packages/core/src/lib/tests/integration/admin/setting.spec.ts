import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminSettingGroupSchema } from '../../../types/admin/settings/setting-group.schema.js';
import { AdminSettingSchema } from '../../../types/admin/settings/setting.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;

beforeAll(() => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });
});

describe('Admin Setting — integration', () => {
  it('lists setting groups and validates schema per item', async () => {
    const { data, error } = await sdk.admin.settings.listGroups();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
    expect((data?.length ?? 0) > 0).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminSettingGroupSchema.safeParse(item);
      expect(
        parsed.success,
        `group safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('lists settings for "general" group and validates schema per item', async () => {
    const { data, error } = await sdk.admin.settings.listSettings('general');

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
    expect((data?.length ?? 0) > 0).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminSettingSchema.safeParse(item);
      expect(
        parsed.success,
        `setting safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a specific setting and validates schema', async () => {
    const { data, error } = await sdk.admin.settings.getSetting(
      'general',
      'woocommerce_default_country'
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminSettingSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe('woocommerce_default_country');
  });
});

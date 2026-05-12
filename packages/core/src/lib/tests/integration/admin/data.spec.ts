import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import {
  AdminCountrySchema,
  AdminCurrencySchema,
} from '../../../types/admin/data/data.schema.js';
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

describe('Admin Data — integration', () => {
  it('lists countries and validates schema per item', async () => {
    const { data, error } = await sdk.admin.data.listCountries();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
    expect((data?.length ?? 0) > 0).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminCountrySchema.safeParse(item);
      expect(
        parsed.success,
        `country safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a specific country (US) and validates schema', async () => {
    const { data, error } = await sdk.admin.data.getCountry('US');

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCountrySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.code).toBe('US');
  });

  it('lists currencies and validates schema per item', async () => {
    const { data, error } = await sdk.admin.data.listCurrencies();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminCurrencySchema.safeParse(item);
      expect(
        parsed.success,
        `currency safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets current currency and validates schema', async () => {
    const { data, error } = await sdk.admin.data.getCurrency('current');

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCurrencySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });
});

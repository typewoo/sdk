import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminTaxSchema } from '../../../types/admin/taxes/tax.schema.js';
import { AdminTaxClassSchema } from '../../../types/admin/taxes/tax-class.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdTaxId = 0;

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

afterAll(async () => {
  if (createdTaxId) {
    await sdk.admin.taxes.delete(createdTaxId, true);
  }
});

describe('Admin Tax — integration', () => {
  it('creates a tax rate and validates schema', async () => {
    const { data, error } = await sdk.admin.taxes.create({
      country: 'US',
      rate: '10.0000',
      name: 'Integration Test Tax',
      shipping: true,
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdTaxId = data!.id;

    const parsed = AdminTaxSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists tax rates and validates schema per item', async () => {
    const result = await sdk.admin.taxes.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminTaxSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a tax rate by id and validates schema', async () => {
    const { data, error } = await sdk.admin.taxes.get(createdTaxId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdTaxId);
  });

  it('updates a tax rate name', async () => {
    const { data, error } = await sdk.admin.taxes.update(createdTaxId, {
      name: 'Updated Integration Tax',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Updated Integration Tax');
  });

  it('deletes the tax rate successfully', async () => {
    const { error } = await sdk.admin.taxes.delete(createdTaxId, true);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdTaxId = 0;
  });
});

describe('Admin Tax Class — integration', () => {
  it('lists tax classes and validates schema per item', async () => {
    const { data, error } = await sdk.admin.taxClasses.list();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminTaxClassSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminBrandSchema } from '../../../types/admin/product-brands/brand.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdBrandId = 0;

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
  if (createdBrandId) {
    await sdk.admin.productBrands.delete(createdBrandId, true);
  }
});

describe('Admin Product Brand — integration', () => {
  it('creates a brand and validates schema', async () => {
    const { data, error } = await sdk.admin.productBrands.create({
      name: 'Test Brand (integration)',
    });

    if (error?.code === 'rest_no_route') {
      // Brand taxonomy not registered in this WC version
      return;
    }

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdBrandId = data!.id;

    const parsed = AdminBrandSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists brands and validates schema per item', async () => {
    const result = await sdk.admin.productBrands.list({ per_page: 5 });

    if (result.error?.code === 'rest_no_route') return;

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminBrandSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets brand by id and validates schema', async () => {
    if (!createdBrandId) return;

    const { data, error } = await sdk.admin.productBrands.get(createdBrandId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminBrandSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdBrandId);
  });

  it('updates brand name and reflects the changed field', async () => {
    if (!createdBrandId) return;

    const { data, error } = await sdk.admin.productBrands.update(
      createdBrandId,
      { name: 'Test Brand (updated)' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminBrandSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Test Brand (updated)');
  });

  it('deletes the created brand successfully', async () => {
    if (!createdBrandId) return;

    const { data, error } = await sdk.admin.productBrands.delete(
      createdBrandId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminBrandSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdBrandId = 0;
  });
});

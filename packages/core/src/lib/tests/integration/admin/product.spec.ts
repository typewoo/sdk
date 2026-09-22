import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import {
  AdminProductSchema,
  AdminProductVariationSchema,
} from '../../../types/admin/products/index.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdProductId = 0;

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
  if (createdProductId) {
    await sdk.admin.products.delete(createdProductId, true);
  }
});

describe('Admin Product — integration', () => {
  it('creates a product and validates schema', async () => {
    const { data, error } = await sdk.admin.products.create({
      name: 'Test Product (integration)',
      type: 'simple',
      status: 'draft',
      regular_price: '9.99',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdProductId = data!.id;

    const parsed = AdminProductSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('gets a product by id and validates schema', async () => {
    const { data, error } = await sdk.admin.products.getById(createdProductId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdProductId);
  });

  it('updates a product and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.products.update(createdProductId, {
      name: 'Test Product (updated)',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Test Product (updated)');
  });

  it('lists variations (empty for simple product) with valid schema per item', async () => {
    const result = await sdk.admin.products.listVariations(createdProductId, {
      per_page: 5,
    });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminProductVariationSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('returns error for invalid product id', async () => {
    const { data, error } = await sdk.admin.products.getById(999999999);

    expect(data).toBeUndefined();
    expect(error?.code).toBe('woocommerce_rest_product_invalid_id');
  });

  it('deletes the created product successfully', async () => {
    const { data, error } = await sdk.admin.products.delete(
      createdProductId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdProductId = 0;
  });
});

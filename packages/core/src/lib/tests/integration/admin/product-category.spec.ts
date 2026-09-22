import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminTaxonomyCategorySchema } from '../../../types/admin/product-categories/product-category.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdCategoryId = 0;

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
  if (createdCategoryId) {
    await sdk.admin.productCategories.delete(createdCategoryId, true);
  }
});

describe('Admin Product Category — integration', () => {
  it('creates a category and validates schema', async () => {
    const { data, error } = await sdk.admin.productCategories.create({
      name: 'Test Category (integration)',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdCategoryId = data!.id;

    const parsed = AdminTaxonomyCategorySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists categories and validates schema per item', async () => {
    const result = await sdk.admin.productCategories.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminTaxonomyCategorySchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets category by id and validates schema', async () => {
    const { data, error } = await sdk.admin.productCategories.get(
      createdCategoryId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxonomyCategorySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdCategoryId);
  });

  it('updates category name and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.productCategories.update(
      createdCategoryId,
      { name: 'Test Category (updated)' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxonomyCategorySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Test Category (updated)');
  });

  it('deletes the created category successfully', async () => {
    const { data, error } = await sdk.admin.productCategories.delete(
      createdCategoryId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxonomyCategorySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdCategoryId = 0;
  });
});

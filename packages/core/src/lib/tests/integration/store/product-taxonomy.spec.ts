import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { ProductCategoryResponseSchema } from '../../../types/store/product-category/product.category.schema.js';
import { ProductTagResponseSchema } from '../../../types/store/product-tag/product.tag.schema.js';
import { ProductReviewResponseSchema } from '../../../types/store/product-review/product.review.schema.js';
import { getWpUrl } from '../../helpers/integration-config.js';

let sdk: TypewooClient;

beforeAll(() => {
  sdk = createTypewoo({ baseUrl: getWpUrl() });
});

describe('Store Product Category — integration', () => {
  it('lists product categories and validates schema per item', async () => {
    const result = await sdk.store.categories.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = ProductCategoryResponseSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });
});

describe('Store Product Tag — integration', () => {
  it('lists product tags and validates schema per item', async () => {
    const result = await sdk.store.tags.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = ProductTagResponseSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });
});

describe('Store Product Review — integration', () => {
  it('lists product reviews and validates schema per item', async () => {
    const result = await sdk.store.reviews.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = ProductReviewResponseSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });
});

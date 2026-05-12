import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { ProductResponseSchema } from '../../../types/store/product/product.schema.js';
import { getWpUrl } from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let firstProductId = 0;

beforeAll(async () => {
  sdk = createTypewoo({ baseUrl: getWpUrl() });

  // Fetch a product to use in single-product tests
  const result = await sdk.store.products.list({ per_page: 1 });
  firstProductId = result.data?.[0]?.id ?? 0;
});

describe('Store Product — integration', () => {
  it('lists products and validates schema per item', async () => {
    const result = await sdk.store.products.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data?.length ?? 0) > 0).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = ProductResponseSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a single product by id and validates schema', async () => {
    if (!firstProductId) return;

    const { data, error } = await sdk.store.products.single({
      id: firstProductId,
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = ProductResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(firstProductId);
  });

  it('filters products by search term without error', async () => {
    const result = await sdk.store.products.list({
      search: 'test',
      per_page: 3,
    });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);
  });
});

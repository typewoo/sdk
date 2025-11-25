import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import { GET_WP_URL } from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

const WP_URL = GET_WP_URL();

describe('Integration: Product Taxonomies (categories, tags, brands)', () => {
  beforeAll(async () => {
    await Typewoo.init({ baseUrl: WP_URL });
  });

  it('lists product categories and fetches single (total may be undefined)', async () => {
    const { data: categories } = await Typewoo.store.categories.list({
      per_page: 20,
    });
    expect(Array.isArray(categories)).toBe(true);
    expect((categories || []).length).toBeGreaterThan(0);
    const first = categories?.[0];
    if (first?.id) {
      const single = await Typewoo.store.categories.single(first.id);
      expect(single.data?.id).toBe(first.id);
    }
  });

  it('lists product tags (total may be undefined)', async () => {
    const { data: tags } = await Typewoo.store.tags.list({ per_page: 25 });
    expect(Array.isArray(tags)).toBe(true);
    expect((tags || []).length).toBeGreaterThan(0);
  });

  it('lists product brands and fetches single (total may be undefined)', async () => {
    const { data: brands } = await Typewoo.store.brands.list({ per_page: 10 });
    expect(Array.isArray(brands)).toBe(true);
    expect((brands || []).length).toBeGreaterThan(0);
    const first = brands?.[0];
    if (first?.id) {
      const single = await Typewoo.store.brands.single(first.id);
      expect(single.data?.id).toBe(first.id);
    }
  });

  it('handles non-existent brand gracefully', async () => {
    const res = await Typewoo.store.brands.single(9999999);
    expect(res.data).toBeFalsy();
    expect((res as unknown as { error?: unknown }).error).toBeTruthy();
  });
});

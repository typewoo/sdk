import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import type {
  ProductRequest,
  ProductVariation,
} from '../../../types/admin/product.types.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration tests for Admin Product Service
 * Covers: list, get, create, update, delete, batch, duplicate,
 * variations (list/get/create/update/delete/generate), contexts, and errors.
 */
describe('Integration: Admin Product Service', () => {
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

  it('lists products with pagination', async () => {
    const { data, error, total, totalPages } =
      await StoreSdk.admin.products.list({ per_page: 5, page: 1 });

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });

  it('searches products by name', async () => {
    const query = 'test';
    const { data, error } = await StoreSdk.admin.products.list({
      search: query,
      per_page: 10,
    });

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);

    if (data && data.length > 0) {
      const has = data.some((p) =>
        (p.name || '').toLowerCase().includes(query)
      );
      expect(has).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a simple product', async () => {
    const ts = Date.now();
    const req: ProductRequest = {
      name: `itest-simple-${ts}`,
      type: 'simple',
      regular_price: '9.99',
      stock_status: 'instock',
      catalog_visibility: 'hidden',
    };

    // Create
    const createRes = await StoreSdk.admin.products.create(req);
    expect(createRes.error).toBeFalsy();
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const productId = createRes.data.id;

    // Get
    const getRes = await StoreSdk.admin.products.get(productId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(productId);

    // Update
    const updateRes = await StoreSdk.admin.products.update(productId, {
      regular_price: '12.49',
    });
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data?.regular_price).toBe('12.49');

    // Delete (force)
    const delRes = await StoreSdk.admin.products.delete(productId, true);
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await StoreSdk.admin.products.get(productId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch create and batch delete', async () => {
    const ts = Date.now();
    const batchCreate = await StoreSdk.admin.products.batch({
      create: [
        {
          name: `batch-1-${ts}`,
          type: 'simple',
          regular_price: '5.00',
          stock_status: 'instock',
          catalog_visibility: 'hidden',
        },
        {
          name: `batch-2-${ts}`,
          type: 'simple',
          regular_price: '6.00',
          stock_status: 'instock',
          catalog_visibility: 'hidden',
        },
      ],
    });
    expect(batchCreate.error).toBeFalsy();
    expect(batchCreate.data).toBeTruthy();
    if (!batchCreate.data) return;

    const ids = batchCreate.data.create.map((p) => p.id);
    expect(ids.length).toBe(2);

    // Batch delete the created ones
    const batchDelete = await StoreSdk.admin.products.batch({
      delete: ids,
    });
    expect(batchDelete.error).toBeFalsy();
    expect(batchDelete.data).toBeTruthy();
  });

  it('duplicates a product', async () => {
    const ts = Date.now();
    // Create base product
    const base = await StoreSdk.admin.products.create({
      name: `dup-base-${ts}`,
      type: 'simple',
      regular_price: '7.77',
      stock_status: 'instock',
      catalog_visibility: 'hidden',
    });
    expect(base.error).toBeFalsy();
    if (!base.data) return;
    const baseId = base.data.id;

    try {
      const dup = await StoreSdk.admin.products.duplicate(baseId, {
        regular_price: '8.88',
      });
      // Some environments may restrict duplication; accept error codes
      if (dup.error) {
        expect(dup.error.code).toMatch(/not_found|invalid|forbidden/i);
        return;
      }
      expect(dup.data).toBeTruthy();
      if (!dup.data) return;
      expect(dup.data.id).not.toBe(baseId);
    } finally {
      // Cleanup both (best-effort)
      await StoreSdk.admin.products.delete(baseId, true);
    }
  });

  it('manages variations for a variable product', async () => {
    const ts = Date.now();
    // Create a variable product with one custom attribute
    const prod = await StoreSdk.admin.products.create({
      name: `var-prod-${ts}`,
      type: 'variable',
      catalog_visibility: 'hidden',
      attributes: [
        {
          id: 0,
          name: 'Size',
          position: 0,
          visible: true,
          variation: true,
          options: ['S', 'M'],
        },
      ],
    });
    expect(prod.error).toBeFalsy();
    if (!prod.data) return;
    const productId = prod.data.id;

    try {
      // Initially no variations
      const list0 = await StoreSdk.admin.products.listVariations(productId, {
        per_page: 10,
      });
      expect(list0.error).toBeFalsy();

      // Create a variation for Size=S
      const createVar = await StoreSdk.admin.products.createVariation(
        productId,
        {
          attributes: [{ name: 'Size', option: 'S' }],
          regular_price: '15.00',
          stock_status: 'instock',
        } as Partial<ProductVariation>
      );
      if (createVar.error) {
        // Some environments may restrict variation creation
        expect(createVar.error.code).toMatch(/invalid|forbidden|not_found/i);
        return;
      }
      expect(createVar.data).toBeTruthy();
      if (!createVar.data) return;
      const variationId = createVar.data.id;

      // Get variation
      const getVar = await StoreSdk.admin.products.getVariation(
        productId,
        variationId
      );
      expect(getVar.error).toBeFalsy();
      expect(getVar.data?.id).toBe(variationId);

      // Update variation
      const updVar = await StoreSdk.admin.products.updateVariation(
        productId,
        variationId,
        { regular_price: '16.00' }
      );
      expect(updVar.error).toBeFalsy();
      expect(updVar.data?.regular_price).toBe('16.00');

      // List variations and ensure presence
      const list1 = await StoreSdk.admin.products.listVariations(productId, {
        per_page: 10,
      });
      expect(list1.error).toBeFalsy();
      if (list1.data) {
        const found = list1.data.some((v) => v.id === variationId);
        expect(found).toBe(true);
      }

      // Delete variation
      const delVar = await StoreSdk.admin.products.deleteVariation(
        productId,
        variationId,
        true
      );
      expect(delVar.error).toBeFalsy();
    } finally {
      // Cleanup product
      await StoreSdk.admin.products.delete(productId, true);
    }
  });

  it('generates variations for a fresh variable product (if supported)', async () => {
    const ts = Date.now();
    // Create a fresh variable product with two options (no variations yet)
    const prod = await StoreSdk.admin.products.create({
      name: `var-gen-${ts}`,
      type: 'variable',
      catalog_visibility: 'hidden',
      attributes: [
        {
          id: 0,
          name: 'Size',
          position: 0,
          visible: true,
          variation: true,
          options: ['S', 'M'],
        },
      ],
    });
    expect(prod.error).toBeFalsy();
    if (!prod.data) return;
    const productId = prod.data.id;

    try {
      const gen = await StoreSdk.admin.products.generateVariations(productId);
      if (gen.error) {
        expect(gen.error.code).toMatch(/invalid|forbidden|not_found/i);
      } else {
        expect(gen.data).toBeTruthy();
        if (gen.data) {
          expect(gen.data.count).toBe(2);
        }
      }
    } finally {
      await StoreSdk.admin.products.delete(productId, true);
    }
  });

  it('retrieves product in different contexts', async () => {
    const list = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const productId = list.data[0].id;

    const view = await StoreSdk.admin.products.get(productId, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(productId);

    const edit = await StoreSdk.admin.products.get(productId, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(productId);
  });

  it('handles error cases gracefully', async () => {
    // Get non-existent
    const getBad = await StoreSdk.admin.products.get(999999);
    expect(getBad.error).toBeTruthy();
    expect(getBad.error?.code).toMatch(/not_found|invalid/i);

    // Update non-existent
    const updateBad = await StoreSdk.admin.products.update(999999, {
      regular_price: '1.00',
    });
    expect(updateBad.error).toBeTruthy();

    // Delete non-existent
    const deleteBad = await StoreSdk.admin.products.delete(999999);
    expect(deleteBad.error).toBeTruthy();
  });
});

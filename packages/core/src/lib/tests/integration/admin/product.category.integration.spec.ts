import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import type { WcAdminProductCategoryRequest } from '../../../types/admin/taxonomy.types.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration: Admin Product Categories
 * Covers list/search, CRUD, batch, contexts, and errors for categories service
 */
describe('Integration: Admin Product Categories', () => {
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

  it('lists categories with pagination', async () => {
    const { data, error, total, totalPages } =
      await StoreSdk.admin.productCategories.list({ per_page: 5, page: 1 });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });

  it('searches categories by name', async () => {
    const query = 'cat';
    const { data, error } = await StoreSdk.admin.productCategories.list({
      search: query,
      per_page: 10,
    });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (data && data.length > 0) {
      const has = data.some((c) =>
        (c.name || '').toLowerCase().includes(query)
      );
      expect(has).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a category', async () => {
    const ts = Date.now();
    const req: WcAdminProductCategoryRequest = {
      name: `itest-cat-${ts}`,
      description: 'Integration category',
      display: 'default',
    };

    // Create
    const createRes = await StoreSdk.admin.productCategories.create(req);
    expect(createRes.error).toBeFalsy();
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const categoryId = createRes.data.id;

    // Get
    const getRes = await StoreSdk.admin.productCategories.get(categoryId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(categoryId);

    // Update
    const updateRes = await StoreSdk.admin.productCategories.update(
      categoryId,
      { description: 'Updated description' }
    );
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data?.description).toContain('Updated');

    // Delete (force)
    const delRes = await StoreSdk.admin.productCategories.delete(
      categoryId,
      true
    );
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await StoreSdk.admin.productCategories.get(categoryId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch create and delete', async () => {
    const ts = Date.now();
    const batch = await StoreSdk.admin.productCategories.batch({
      create: [
        { name: `Batch Cat A ${ts}`, description: 'A', display: 'default' },
        { name: `Batch Cat B ${ts}`, description: 'B', display: 'default' },
      ],
    });
    expect(batch.error).toBeFalsy();
    if (!batch.data) return;
    const ids = batch.data.create.map((c) => c.id);

    const batchDel = await StoreSdk.admin.productCategories.batch({
      delete: ids,
    });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves category in different contexts', async () => {
    const list = await StoreSdk.admin.productCategories.list({ per_page: 1 });
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const view = await StoreSdk.admin.productCategories.get(id, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await StoreSdk.admin.productCategories.get(id, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(id);
  });

  it('handles category error cases gracefully', async () => {
    const notFound = await StoreSdk.admin.productCategories.get(999999);
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(/not_found|invalid/i);

    const badCreate = await StoreSdk.admin.productCategories.create({
      name: '',
    });
    expect(badCreate.error).toBeTruthy();

    const badUpdate = await StoreSdk.admin.productCategories.update(999999, {
      description: 'Nope',
    });
    expect(badUpdate.error).toBeTruthy();

    const badDelete = await StoreSdk.admin.productCategories.delete(999999);
    expect(badDelete.error).toBeTruthy();
  });
});

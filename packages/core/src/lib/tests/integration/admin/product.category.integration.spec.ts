import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
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
    await Typewoo.init({
      baseUrl: GET_WP_URL(),
      admin: {
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists categories with pagination', async () => {
    const { data, error } = await Typewoo.admin.productCategories.list({
      per_page: 5,
      page: 1,
    });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
  });

  it('searches categories by name', async () => {
    const query = 'cat';
    const { data, error } = await Typewoo.admin.productCategories.list({
      search: query,
      per_page: 10,
    });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (data && data.length > 0) {
      const has = data.some((c) =>
        (c.name || '').toLowerCase().includes(query),
      );
      expect(has).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a category', async () => {
    const ts = Date.now();
    const req: AdminProductCategoryRequest = {
      name: `itest-cat-${ts}`,
      description: 'Integration category',
      display: 'default',
    };

    // Create
    const createRes = await Typewoo.admin.productCategories.create(req);
    expect(createRes.error).toBeFalsy();
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const categoryId = createRes.data.id;

    // Get
    const getRes = await Typewoo.admin.productCategories.get(categoryId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(categoryId);

    // Update
    const updateRes = await Typewoo.admin.productCategories.update(categoryId, {
      description: 'Updated description',
    });
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data?.description).toContain('Updated');

    // Delete (force)
    const delRes = await Typewoo.admin.productCategories.delete(
      categoryId,
      true,
    );
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await Typewoo.admin.productCategories.get(categoryId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch create and delete', async () => {
    const ts = Date.now();
    const batch = await Typewoo.admin.productCategories.batch({
      create: [
        { name: `Batch Cat A ${ts}`, description: 'A', display: 'default' },
        { name: `Batch Cat B ${ts}`, description: 'B', display: 'default' },
      ],
    });
    expect(batch.error).toBeFalsy();
    if (!batch.data) return;
    const ids = batch.data.create.map((c) => c.id);

    const batchDel = await Typewoo.admin.productCategories.batch({
      delete: ids,
    });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves category in different contexts', async () => {
    const list = await Typewoo.admin.productCategories.list({ per_page: 1 });
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const view = await Typewoo.admin.productCategories.get(id, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await Typewoo.admin.productCategories.get(id, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(id);
  });

  it('handles category error cases gracefully', async () => {
    const notFound = await Typewoo.admin.productCategories.get(999999);
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(/not_found|invalid/i);

    const badCreate = await Typewoo.admin.productCategories.create({
      name: '',
    });
    expect(badCreate.error).toBeTruthy();

    const badUpdate = await Typewoo.admin.productCategories.update(999999, {
      description: 'Nope',
    });
    expect(badUpdate.error).toBeTruthy();

    const badDelete = await Typewoo.admin.productCategories.delete(999999);
    expect(badDelete.error).toBeTruthy();
  });
});

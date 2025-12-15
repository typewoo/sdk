import { describe, it, expect, beforeAll } from 'vitest';
import { AdminBrandRequest, Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration: Admin Product Brands
 * Covers list/search, CRUD, batch, contexts, and errors for brands service
 */
describe('Integration: Admin Product Brands', () => {
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

  it('lists brands with pagination', async () => {
    const { data, error } = await Typewoo.admin.productBrands.list({
      per_page: 5,
      page: 1,
    });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
  });

  it('searches brands by name', async () => {
    const query = 'brand';
    const { data, error } = await Typewoo.admin.productBrands.list({
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

  it('creates, retrieves, updates, and deletes a brand', async () => {
    const ts = Date.now();
    const req: AdminBrandRequest = {
      name: `itest-brand-${ts}`,
      description: 'Integration brand',
      display: 'default',
    };

    // Create
    const createRes = await Typewoo.admin.productBrands.create(req);
    expect(createRes.error).toBeFalsy();
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const brandId = createRes.data.id;

    // Get
    const getRes = await Typewoo.admin.productBrands.get(brandId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(brandId);

    // Update
    const updateRes = await Typewoo.admin.productBrands.update(brandId, {
      description: 'Updated description',
    });
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data?.description).toContain('Updated');

    // Delete (force)
    const delRes = await Typewoo.admin.productBrands.delete(brandId, true);
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await Typewoo.admin.productBrands.get(brandId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch create and delete', async () => {
    const ts = Date.now();
    const batch = await Typewoo.admin.productBrands.batch({
      create: [
        { name: `Batch Brand A ${ts}`, description: 'A', display: 'default' },
        { name: `Batch Brand B ${ts}`, description: 'B', display: 'default' },
      ],
    });
    expect(batch.error).toBeFalsy();
    if (!batch.data) return;
    const ids = batch.data.create.map((c) => c.id);

    const batchDel = await Typewoo.admin.productBrands.batch({ delete: ids });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves brand in different contexts', async () => {
    const list = await Typewoo.admin.productBrands.list({ per_page: 1 });
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const view = await Typewoo.admin.productBrands.get(id, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await Typewoo.admin.productBrands.get(id, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(id);
  });

  it('handles brand error cases gracefully', async () => {
    const notFound = await Typewoo.admin.productBrands.get(999999);
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(
      /not_found|invalid|forbidden|unsupported/i,
    );

    const badCreate = await Typewoo.admin.productBrands.create({ name: '' });
    expect(badCreate.error).toBeTruthy();

    const badUpdate = await Typewoo.admin.productBrands.update(999999, {
      description: 'Nope',
    });
    expect(badUpdate.error).toBeTruthy();

    const badDelete = await Typewoo.admin.productBrands.delete(999999);
    expect(badDelete.error).toBeTruthy();
  });
});

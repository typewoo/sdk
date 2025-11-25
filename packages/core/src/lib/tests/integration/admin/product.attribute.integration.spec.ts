import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import {
  AdminProductAttributeRequest,
  AdminProductAttributeTermRequest,
} from '@typewoo/types';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration: Admin Product Attributes & Terms
 * Covers productAttributes and attributeTerms services: list/get/create/update/delete/batch/contexts/errors
 */
describe('Integration: Admin Product Attributes & Terms', () => {
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

  it('lists product attributes', async () => {
    const { data, error, total, totalPages } =
      await Typewoo.admin.productAttributes.list({});

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });

  it('creates, retrieves, updates, and deletes a product attribute', async () => {
    const ts = Date.now();
    const req: AdminProductAttributeRequest = {
      name: `Material ${ts}`,
      order_by: 'menu_order',
      has_archives: false,
    };

    // Create
    const createRes = await Typewoo.admin.productAttributes.create(req);
    expect(createRes.error).toBeFalsy();
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const attrId = createRes.data.id;

    // Get
    const getRes = await Typewoo.admin.productAttributes.get(attrId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(attrId);

    // Update
    const updateRes = await Typewoo.admin.productAttributes.update(attrId, {
      has_archives: true,
    });
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data?.has_archives).toBe(true);

    // Delete (force)
    const delRes = await Typewoo.admin.productAttributes.delete(attrId, true);
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await Typewoo.admin.productAttributes.get(attrId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles attribute batch create & delete', async () => {
    const ts = Date.now();
    const batch = await Typewoo.admin.productAttributes.batch({
      create: [
        { name: `Attr A ${ts}`, order_by: 'menu_order', has_archives: false },
        { name: `Attr B ${ts}`, order_by: 'menu_order', has_archives: false },
      ],
    });
    expect(batch.error).toBeFalsy();
    if (!batch.data) return;
    const ids = batch.data.create.map((a) => a.id);

    const batchDel = await Typewoo.admin.productAttributes.batch({
      delete: ids,
    });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves attribute in different contexts', async () => {
    const list = await Typewoo.admin.productAttributes.list({});
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const view = await Typewoo.admin.productAttributes.get(id, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await Typewoo.admin.productAttributes.get(id, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(id);
  });

  it('handles attribute error cases', async () => {
    const notFound = await Typewoo.admin.productAttributes.get(999999);
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(/not_found|invalid/i);

    const badCreate = await Typewoo.admin.productAttributes.create({
      name: '',
    });
    expect(badCreate.error).toBeTruthy();

    const badUpdate = await Typewoo.admin.productAttributes.update(999999, {
      name: 'Nope',
    });
    expect(badUpdate.error).toBeTruthy();

    const badDelete = await Typewoo.admin.productAttributes.delete(999999);
    expect(badDelete.error).toBeTruthy();
  });

  it('lists, creates, retrieves, updates, and deletes attribute terms', async () => {
    // Ensure an attribute exists to attach terms to
    const base = await Typewoo.admin.productAttributes.create({
      name: `Color ${Date.now()}`,
      order_by: 'menu_order',
      has_archives: false,
    });
    expect(base.error).toBeFalsy();
    if (!base.data) return;
    const attributeId = base.data.id;

    try {
      // List terms (empty is fine)
      const list0 = await Typewoo.admin.attributeTerms.list(attributeId, {
        per_page: 10,
      });
      expect(list0.error).toBeFalsy();

      // Create a term
      const termReq: AdminProductAttributeTermRequest = {
        name: 'Red',
        description: 'A red color',
        menu_order: 0,
      };
      const created = await Typewoo.admin.attributeTerms.create(
        attributeId,
        termReq
      );
      expect(created.error).toBeFalsy();
      if (!created.data) return;
      const termId = created.data.id;

      // Get term
      const got = await Typewoo.admin.attributeTerms.get(attributeId, termId);
      expect(got.error).toBeFalsy();
      expect(got.data?.id).toBe(termId);

      // Update term
      const updated = await Typewoo.admin.attributeTerms.update(
        attributeId,
        termId,
        { description: 'Updated red' }
      );
      expect(updated.error).toBeFalsy();
      expect(updated.data?.description).toContain('Updated');

      // List and ensure presence
      const list1 = await Typewoo.admin.attributeTerms.list(attributeId, {
        per_page: 10,
      });
      expect(list1.error).toBeFalsy();
      if (list1.data) {
        const found = list1.data.some((t) => t.id === termId);
        expect(found).toBe(true);
      }

      // Delete term
      const del = await Typewoo.admin.attributeTerms.delete(
        attributeId,
        termId,
        true
      );
      expect(del.error).toBeFalsy();
    } finally {
      // Cleanup attribute
      await Typewoo.admin.productAttributes.delete(attributeId, true);
    }
  });

  it('handles attribute terms batch and errors', async () => {
    // Ensure an attribute exists
    const base = await Typewoo.admin.productAttributes.create({
      name: `Size ${Date.now()}`,
      order_by: 'menu_order',
      has_archives: false,
    });
    expect(base.error).toBeFalsy();
    if (!base.data) return;
    const attributeId = base.data.id;

    try {
      // Batch create two terms
      const batch = await Typewoo.admin.attributeTerms.batch(attributeId, {
        create: [
          { name: 'S', menu_order: 0 },
          { name: 'M', menu_order: 1 },
        ],
      });
      expect(batch.error).toBeFalsy();
      if (!batch.data) return;
      const termIds = batch.data.create.map((t) => t.id);

      // Batch delete
      const batchDel = await Typewoo.admin.attributeTerms.batch(attributeId, {
        delete: termIds,
      });
      expect(batchDel.error).toBeFalsy();

      // Error paths
      const notFound = await Typewoo.admin.attributeTerms.get(
        attributeId,
        999999
      );
      expect(notFound.error).toBeTruthy();
      expect(notFound.error?.code).toMatch(/not_found|invalid/i);

      const badCreate = await Typewoo.admin.attributeTerms.create(attributeId, {
        name: '',
      });
      expect(badCreate.error).toBeTruthy();

      const badUpdate = await Typewoo.admin.attributeTerms.update(
        attributeId,
        999999,
        { description: 'Nope' }
      );
      expect(badUpdate.error).toBeTruthy();

      const badDelete = await Typewoo.admin.attributeTerms.delete(
        attributeId,
        999999
      );
      expect(badDelete.error).toBeTruthy();
    } finally {
      await Typewoo.admin.productAttributes.delete(attributeId, true);
    }
  });
});

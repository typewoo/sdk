import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import type {
  WcAdminProductAttributeRequest,
  WcAdminProductAttributeTermRequest,
} from '../../../types/admin/attribute.types.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';

/**
 * Integration: Admin Product Attributes & Terms
 * Covers productAttributes and attributeTerms services: list/get/create/update/delete/batch/contexts/errors
 */
describe('Integration: Admin Product Attributes & Terms', () => {
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

  it('lists product attributes', async () => {
    const { data, error, total, totalPages } =
      await StoreSdk.admin.productAttributes.list({});

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });

  it('creates, retrieves, updates, and deletes a product attribute', async () => {
    const ts = Date.now();
    const req: WcAdminProductAttributeRequest = {
      name: `Material ${ts}`,
      order_by: 'menu_order',
      has_archives: false,
    };

    // Create
    const createRes = await StoreSdk.admin.productAttributes.create(req);
    expect(createRes.error).toBeFalsy();
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const attrId = createRes.data.id;

    // Get
    const getRes = await StoreSdk.admin.productAttributes.get(attrId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(attrId);

    // Update
    const updateRes = await StoreSdk.admin.productAttributes.update(attrId, {
      has_archives: true,
    });
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data?.has_archives).toBe(true);

    // Delete (force)
    const delRes = await StoreSdk.admin.productAttributes.delete(attrId, true);
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await StoreSdk.admin.productAttributes.get(attrId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles attribute batch create & delete', async () => {
    const ts = Date.now();
    const batch = await StoreSdk.admin.productAttributes.batch({
      create: [
        { name: `Attr A ${ts}`, order_by: 'menu_order', has_archives: false },
        { name: `Attr B ${ts}`, order_by: 'menu_order', has_archives: false },
      ],
    });
    expect(batch.error).toBeFalsy();
    if (!batch.data) return;
    const ids = batch.data.create.map((a) => a.id);

    const batchDel = await StoreSdk.admin.productAttributes.batch({
      delete: ids,
    });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves attribute in different contexts', async () => {
    const list = await StoreSdk.admin.productAttributes.list({});
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const view = await StoreSdk.admin.productAttributes.get(id, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await StoreSdk.admin.productAttributes.get(id, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(id);
  });

  it('handles attribute error cases', async () => {
    const notFound = await StoreSdk.admin.productAttributes.get(999999);
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(/not_found|invalid/i);

    const badCreate = await StoreSdk.admin.productAttributes.create({
      name: '',
    });
    expect(badCreate.error).toBeTruthy();

    const badUpdate = await StoreSdk.admin.productAttributes.update(999999, {
      name: 'Nope',
    });
    expect(badUpdate.error).toBeTruthy();

    const badDelete = await StoreSdk.admin.productAttributes.delete(999999);
    expect(badDelete.error).toBeTruthy();
  });

  it('lists, creates, retrieves, updates, and deletes attribute terms', async () => {
    // Ensure an attribute exists to attach terms to
    const base = await StoreSdk.admin.productAttributes.create({
      name: `Color ${Date.now()}`,
      order_by: 'menu_order',
      has_archives: false,
    });
    expect(base.error).toBeFalsy();
    if (!base.data) return;
    const attributeId = base.data.id;

    try {
      // List terms (empty is fine)
      const list0 = await StoreSdk.admin.attributeTerms.list(attributeId, {
        per_page: 10,
      });
      expect(list0.error).toBeFalsy();

      // Create a term
      const termReq: WcAdminProductAttributeTermRequest = {
        name: 'Red',
        description: 'A red color',
        menu_order: 0,
      };
      const created = await StoreSdk.admin.attributeTerms.create(
        attributeId,
        termReq
      );
      expect(created.error).toBeFalsy();
      if (!created.data) return;
      const termId = created.data.id;

      // Get term
      const got = await StoreSdk.admin.attributeTerms.get(attributeId, termId);
      expect(got.error).toBeFalsy();
      expect(got.data?.id).toBe(termId);

      // Update term
      const updated = await StoreSdk.admin.attributeTerms.update(
        attributeId,
        termId,
        { description: 'Updated red' }
      );
      expect(updated.error).toBeFalsy();
      expect(updated.data?.description).toContain('Updated');

      // List and ensure presence
      const list1 = await StoreSdk.admin.attributeTerms.list(attributeId, {
        per_page: 10,
      });
      expect(list1.error).toBeFalsy();
      if (list1.data) {
        const found = list1.data.some((t) => t.id === termId);
        expect(found).toBe(true);
      }

      // Delete term
      const del = await StoreSdk.admin.attributeTerms.delete(
        attributeId,
        termId,
        true
      );
      expect(del.error).toBeFalsy();
    } finally {
      // Cleanup attribute
      await StoreSdk.admin.productAttributes.delete(attributeId, true);
    }
  });

  it('handles attribute terms batch and errors', async () => {
    // Ensure an attribute exists
    const base = await StoreSdk.admin.productAttributes.create({
      name: `Size ${Date.now()}`,
      order_by: 'menu_order',
      has_archives: false,
    });
    expect(base.error).toBeFalsy();
    if (!base.data) return;
    const attributeId = base.data.id;

    try {
      // Batch create two terms
      const batch = await StoreSdk.admin.attributeTerms.batch(attributeId, {
        create: [
          { name: 'S', menu_order: 0 },
          { name: 'M', menu_order: 1 },
        ],
      });
      expect(batch.error).toBeFalsy();
      if (!batch.data) return;
      const termIds = batch.data.create.map((t) => t.id);

      // Batch delete
      const batchDel = await StoreSdk.admin.attributeTerms.batch(attributeId, {
        delete: termIds,
      });
      expect(batchDel.error).toBeFalsy();

      // Error paths
      const notFound = await StoreSdk.admin.attributeTerms.get(
        attributeId,
        999999
      );
      expect(notFound.error).toBeTruthy();
      expect(notFound.error?.code).toMatch(/not_found|invalid/i);

      const badCreate = await StoreSdk.admin.attributeTerms.create(
        attributeId,
        { name: '' }
      );
      expect(badCreate.error).toBeTruthy();

      const badUpdate = await StoreSdk.admin.attributeTerms.update(
        attributeId,
        999999,
        { description: 'Nope' }
      );
      expect(badUpdate.error).toBeTruthy();

      const badDelete = await StoreSdk.admin.attributeTerms.delete(
        attributeId,
        999999
      );
      expect(badDelete.error).toBeTruthy();
    } finally {
      await StoreSdk.admin.productAttributes.delete(attributeId, true);
    }
  });
});

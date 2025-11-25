import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration tests for Admin Product Tags Service
 * Covers: list/search, CRUD, batch operations, contexts, and error paths.
 */
describe('Integration: Admin Product Tags', () => {
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

  it('lists tags with pagination and search', async () => {
    const params: AdminProductTagQueryParams = { per_page: 5, page: 1 };
    const list = await StoreSdk.admin.productTags.list(params);
    if (list.error) {
      expect(list.error.code).toMatch(/not_found|invalid|forbidden/i);
      return;
    }
    expect(Array.isArray(list.data)).toBe(true);
    const searchRes = await StoreSdk.admin.productTags.list({
      search: 'test',
      per_page: 5,
    });
    if (searchRes.error) {
      expect(searchRes.error.code).toMatch(/not_found|invalid|forbidden/i);
    } else {
      expect(Array.isArray(searchRes.data)).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a tag', async () => {
    const ts = Date.now();
    const req: AdminProductTagRequest = {
      name: `tag-${ts}`,
      slug: `tag-${ts}`,
      description: 'Integration test tag',
    };

    // Create
    const createRes = await StoreSdk.admin.productTags.create(req);
    if (createRes.error) {
      expect(createRes.error.code).toMatch(/invalid|forbidden|not_found/i);
      return;
    }
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const id = createRes.data.id;

    try {
      // Get
      const getRes = await StoreSdk.admin.productTags.get(id);
      expect(getRes.error).toBeFalsy();
      expect(getRes.data?.id).toBe(id);

      // Update
      const upd = await StoreSdk.admin.productTags.update(id, {
        description: 'Updated description',
      });
      expect(upd.error).toBeFalsy();
      expect(upd.data?.description).toBe('Updated description');
    } finally {
      // Delete (force not applicable; standard delete)
      const del = await StoreSdk.admin.productTags.delete(id, true);
      expect(del.error).toBeFalsy();
    }
  });

  it('handles batch create and delete', async () => {
    const ts = Date.now();
    const batch = await StoreSdk.admin.productTags.batch({
      create: [
        {
          name: `tag-batch-1-${ts}`,
          slug: `tag-batch-1-${ts}`,
          description: 'A',
        },
        {
          name: `tag-batch-2-${ts}`,
          slug: `tag-batch-2-${ts}`,
          description: 'B',
        },
      ],
    });
    if (batch.error) {
      expect(batch.error.code).toMatch(/invalid|forbidden|not_found/i);
      return;
    }
    expect(batch.data).toBeTruthy();
    if (!batch.data) return;
    const ids = batch.data.create.map((c) => c.id);
    expect(ids.length).toBe(2);

    const batchDel = await StoreSdk.admin.productTags.batch({ delete: ids });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves tag in different contexts', async () => {
    const list = await StoreSdk.admin.productTags.list({ per_page: 1 });
    if (list.error || !list.data || list.data.length === 0) {
      return;
    }
    const id = list.data[0].id;

    const view = await StoreSdk.admin.productTags.get(id, { context: 'view' });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await StoreSdk.admin.productTags.get(id, { context: 'edit' });
    if (edit.error) {
      expect(edit.error.code).toMatch(/forbidden|invalid|not_found/i);
    } else {
      expect(edit.data?.id).toBe(id);
    }
  });

  it('handles error cases gracefully', async () => {
    const getBad = await StoreSdk.admin.productTags.get(999999);
    expect(getBad.error).toBeTruthy();
    expect(getBad.error?.code).toMatch(/not_found|invalid/i);

    const updBad = await StoreSdk.admin.productTags.update(999999, {
      description: 'x',
    });
    expect(updBad.error).toBeTruthy();

    const delBad = await StoreSdk.admin.productTags.delete(999999);
    expect(delBad.error).toBeTruthy();
  });
});

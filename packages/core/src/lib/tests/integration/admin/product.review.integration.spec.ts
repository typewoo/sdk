import { describe, it, expect, beforeAll } from 'vitest';
import { AdminProductReviewRequest, Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration: Admin Product Reviews
 * Covers list/search, CRUD, batch, contexts, and errors for reviews service
 */
describe('Integration: Admin Product Reviews', () => {
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

  it('lists reviews with pagination', async () => {
    const { data, error } = await Typewoo.admin.productReviews.list({
      per_page: 5,
      page: 1,
    });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
  });

  it('searches reviews by reviewer or content', async () => {
    const query = 'test';
    const { data, error } = await Typewoo.admin.productReviews.list({
      search: query,
      per_page: 10,
    });
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    if (data && data.length > 0) {
      const has = data.some((r) =>
        ((r.reviewer || '') + ' ' + (r.review || ''))
          .toLowerCase()
          .includes(query),
      );
      expect(has).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a review', async () => {
    // Try to find an existing product to attach a review to
    const products = await Typewoo.admin.products.list({ per_page: 1 });
    expect(products.error).toBeFalsy();
    if (!products.data || products.data.length === 0) return; // environment may not have products
    const productId = products.data[0].id;

    const ts = Date.now();
    const req: AdminProductReviewRequest = {
      product_id: productId,
      reviewer: `itest-reviewer-${ts}`,
      reviewer_email: `itest-${ts}@example.com`,
      review: 'Integration review body',
      rating: 5,
      status: 'approved',
    };

    // Create
    const createRes = await Typewoo.admin.productReviews.create(req);
    if (createRes.error) {
      // Some environments may disallow programmatic reviews; accept expected admin errors
      expect(createRes.error.code).toMatch(/invalid|forbidden|unsupported/i);
      return;
    }
    expect(createRes.data).toBeTruthy();
    if (!createRes.data) return;
    const reviewId = createRes.data.id;

    // Get
    const getRes = await Typewoo.admin.productReviews.get(reviewId);
    expect(getRes.error).toBeFalsy();
    expect(getRes.data?.id).toBe(reviewId);

    // Update
    const updateRes = await Typewoo.admin.productReviews.update(reviewId, {
      review: 'Updated review body',
      rating: 4,
    });
    expect(updateRes.error).toBeFalsy();
    expect(updateRes.data).toBeTruthy();
    if (updateRes.data) {
      expect(updateRes.data.review).toContain('Updated');
    }

    // Delete (force)
    const delRes = await Typewoo.admin.productReviews.delete(reviewId, true);
    expect(delRes.error).toBeFalsy();

    // Verify deleted
    const getDeleted = await Typewoo.admin.productReviews.get(reviewId);
    expect(getDeleted.error).toBeTruthy();
    expect(getDeleted.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch create and delete', async () => {
    const products = await Typewoo.admin.products.list({ per_page: 1 });
    expect(products.error).toBeFalsy();
    if (!products.data || products.data.length === 0) return;
    const productId = products.data[0].id;

    const ts = Date.now();
    const batch = await Typewoo.admin.productReviews.batch({
      create: [
        {
          product_id: productId,
          reviewer: `Batch Reviewer A ${ts}`,
          reviewer_email: `batch-a-${ts}@example.com`,
          review: 'Batch review A',
          rating: 5,
          status: 'approved',
        },
        {
          product_id: productId,
          reviewer: `Batch Reviewer B ${ts}`,
          reviewer_email: `batch-b-${ts}@example.com`,
          review: 'Batch review B',
          rating: 4,
          status: 'approved',
        },
      ],
    });
    if (batch.error) {
      expect(batch.error.code).toMatch(/invalid|forbidden|unsupported/i);
      return;
    }
    expect(batch.data).toBeTruthy();
    if (!batch.data) return;
    const ids = batch.data.create.map((r) => r.id);

    const batchDel = await Typewoo.admin.productReviews.batch({ delete: ids });
    expect(batchDel.error).toBeFalsy();
  });

  it('retrieves review in different contexts', async () => {
    const list = await Typewoo.admin.productReviews.list({ per_page: 1 });
    expect(list.error).toBeFalsy();
    if (!list.data || list.data.length === 0) return;
    const id = list.data[0].id;

    const view = await Typewoo.admin.productReviews.get(id, {
      context: 'view',
    });
    expect(view.error).toBeFalsy();
    expect(view.data?.id).toBe(id);

    const edit = await Typewoo.admin.productReviews.get(id, {
      context: 'edit',
    });
    expect(edit.error).toBeFalsy();
    expect(edit.data?.id).toBe(id);
  });

  it('handles review error cases gracefully', async () => {
    const notFound = await Typewoo.admin.productReviews.get(999999);
    expect(notFound.error).toBeTruthy();
    expect(notFound.error?.code).toMatch(
      /not_found|invalid|forbidden|unsupported/i,
    );

    const badCreate = await Typewoo.admin.productReviews.create({
      product_id: 0,
      reviewer: '',
      reviewer_email: 'not-an-email',
      review: '',
      rating: 0,
    });
    expect(badCreate.error).toBeTruthy();

    const badUpdate = await Typewoo.admin.productReviews.update(999999, {
      review: 'Nope',
    });
    expect(badUpdate.error).toBeTruthy();

    const badDelete = await Typewoo.admin.productReviews.delete(999999);
    expect(badDelete.error).toBeTruthy();
  });
});

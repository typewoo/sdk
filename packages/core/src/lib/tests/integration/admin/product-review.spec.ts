import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminProductReviewSchema } from '../../../types/admin/product-reviews/product-review.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdProductId = 0;
let createdReviewId = 0;

beforeAll(async () => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });

  const { data } = await sdk.admin.products.create({
    name: 'Review Test Product (integration)',
    type: 'simple',
    status: 'publish',
    regular_price: '5.00',
    reviews_allowed: true,
  });
  createdProductId = data!.id;
});

afterAll(async () => {
  if (createdReviewId) {
    await sdk.admin.productReviews.delete(createdReviewId, true);
  }
  if (createdProductId) {
    await sdk.admin.products.delete(createdProductId, true);
  }
});

describe('Admin Product Review — integration', () => {
  it('creates a product review and validates schema', async () => {
    const { data, error } = await sdk.admin.productReviews.create({
      product_id: createdProductId,
      review: 'Great integration test product!',
      reviewer: 'Integration Tester',
      reviewer_email: 'tester@example.com',
      rating: 5,
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdReviewId = data!.id;

    const parsed = AdminProductReviewSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists reviews and validates schema per item', async () => {
    const result = await sdk.admin.productReviews.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminProductReviewSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets review by id and validates schema', async () => {
    const { data, error } = await sdk.admin.productReviews.get(createdReviewId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductReviewSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdReviewId);
  });

  it('updates review content and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.productReviews.update(
      createdReviewId,
      { review: 'Updated review content!' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductReviewSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.review).toBe('Updated review content!');
  });

  it('deletes the review successfully', async () => {
    const { data, error } = await sdk.admin.productReviews.delete(
      createdReviewId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdReviewId = 0;
  });
});

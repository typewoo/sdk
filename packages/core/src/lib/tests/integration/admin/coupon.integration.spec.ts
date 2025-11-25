import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { AdminCouponRequest } from '@typewoo/types';

config({ path: resolve(__dirname, '../../../../../../../.env') });

describe('Integration: Admin Coupon Service', () => {
  beforeAll(async () => {
    // Initialize SDK with admin authentication for admin operations
    // Note: Typewoo.init() requires store access even for admin-only operations
    await Typewoo.init({
      baseUrl: GET_WP_URL(),
      admin: {
        // Admin operations require consumer key/secret authentication
        // These are provided by the WordPress setup script
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists coupons with pagination', async () => {
    const { data, error, total, totalPages } = await Typewoo.admin.coupons.list(
      {
        per_page: 5,
        page: 1,
      }
    );

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);

    // Check pagination headers if present
    if (total) {
      expect(Number(total)).toBeGreaterThanOrEqual(0);
    }
    if (totalPages) {
      expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
    }
  });

  it('searches coupons by code', async () => {
    const code = 'percent15';
    const { data, error } = await Typewoo.admin.coupons.list({
      search: code,
      per_page: 10,
    });

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);

    // If coupons found, verify they contain the search term
    if (data && data.length > 0) {
      const hasSearchTerm = data.some((coupon) =>
        coupon.code.toLowerCase().includes(code)
      );
      expect(hasSearchTerm).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a coupon', async () => {
    const testCouponData: AdminCouponRequest = {
      code: `test-coupon-${Date.now()}`,
      discount_type: 'percent',
      amount: '10.00',
      description: 'Test coupon for integration testing',
      usage_limit: 1,
      individual_use: true,
      exclude_sale_items: false,
      minimum_amount: '0',
    };

    // Create coupon
    const createResult = await Typewoo.admin.coupons.create(testCouponData);
    expect(createResult.error).toBeFalsy();
    expect(createResult.data).toBeTruthy();

    if (!createResult.data) {
      throw new Error('Failed to create test coupon');
    }

    expect(createResult.data.code).toBe(testCouponData.code);
    expect(createResult.data.discount_type).toBe(testCouponData.discount_type);
    expect(createResult.data.amount).toBe(testCouponData.amount);
    // Retrieve the created coupon
    const getResult = await Typewoo.admin.coupons.get(createResult.data.id);
    expect(getResult.error).toBeFalsy();
    expect(getResult.data).toBeTruthy();
    expect(getResult.data?.id).toBe(createResult.data.id);
    expect(getResult.data?.code).toBe(testCouponData.code);

    // Update the coupon
    const updateData: AdminCouponRequest = {
      amount: '15.00',
      description: 'Updated test coupon description',
    };

    const updateResult = await Typewoo.admin.coupons.update(
      createResult.data.id,
      updateData
    );
    expect(updateResult.error).toBeFalsy();
    expect(updateResult.data).toBeTruthy();
    expect(updateResult.data?.amount).toBe('15.00');
    expect(updateResult.data?.description).toBe(updateData.description);

    // Delete the coupon (force delete to skip trash)
    const deleteResult = await Typewoo.admin.coupons.delete(
      createResult.data.id,
      true
    );
    expect(deleteResult.error).toBeFalsy();
    expect(deleteResult.data).toBeTruthy();

    // Verify coupon is deleted
    const getDeletedResult = await Typewoo.admin.coupons.get(
      createResult.data.id
    );
    expect(getDeletedResult.error).toBeTruthy();
    expect(getDeletedResult.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch operations', async () => {
    const batchData = {
      create: [
        {
          code: `batch-test-1-${Date.now()}`,
          discount_type: 'percent' as const,
          amount: '5',
          description: 'Batch test coupon 1',
        },
        {
          code: `batch-test-2-${Date.now()}`,
          discount_type: 'fixed_cart' as const,
          amount: '10',
          description: 'Batch test coupon 2',
        },
      ],
    };

    const batchResult = await Typewoo.admin.coupons.batch(batchData);
    expect(batchResult.error).toBeFalsy();
    expect(batchResult.data).toBeTruthy();

    if (batchResult.data) {
      expect(Array.isArray(batchResult.data.create)).toBe(true);
      expect(batchResult.data.create).toHaveLength(2);

      // Verify created coupons
      const created1 = batchResult.data.create[0];
      const created2 = batchResult.data.create[1];

      expect(created1.code).toBe(batchData.create[0].code);
      expect(created1.discount_type).toBe(batchData.create[0].discount_type);

      expect(created2.code).toBe(batchData.create[1].code);
      expect(created2.discount_type).toBe(batchData.create[1].discount_type);
      // Clean up - delete the created coupons
      await Promise.all([
        Typewoo.admin.coupons.delete(created1.id, true),
        Typewoo.admin.coupons.delete(created2.id, true),
      ]);
    }
  });

  it('handles error cases gracefully', async () => {
    // Test getting non-existent coupon
    const nonExistentResult = await Typewoo.admin.coupons.get(999999);
    expect(nonExistentResult.error).toBeTruthy();
    expect(nonExistentResult.error?.code).toMatch(/not_found|invalid/i);

    // Test creating coupon with invalid data
    const invalidCouponData: AdminCouponRequest = {
      code: '', // Empty code should be invalid
      discount_type: 'percent',
      amount: 'invalid_amount', // Invalid amount
    };

    const invalidCreateResult = await Typewoo.admin.coupons.create(
      invalidCouponData
    );
    expect(invalidCreateResult.error).toBeTruthy();

    // Test updating non-existent coupon
    const invalidUpdateResult = await Typewoo.admin.coupons.update(999999, {
      amount: '10',
    });
    expect(invalidUpdateResult.error).toBeTruthy();

    // Test deleting non-existent coupon
    const invalidDeleteResult = await Typewoo.admin.coupons.delete(999999);
    expect(invalidDeleteResult.error).toBeTruthy();
  });

  it('retrieves coupon in different contexts', async () => {
    // First get list to find an existing coupon
    const listResult = await Typewoo.admin.coupons.list({ per_page: 1 });
    expect(listResult.error).toBeFalsy();

    if (listResult.data && listResult.data.length > 0) {
      const couponId = listResult.data[0].id;

      // Test view context
      const viewResult = await Typewoo.admin.coupons.get(couponId, {
        context: 'view',
      });
      expect(viewResult.error).toBeFalsy();
      expect(viewResult.data).toBeTruthy();
      expect(viewResult.data?.id).toBe(couponId);

      // Test edit context
      const editResult = await Typewoo.admin.coupons.get(couponId, {
        context: 'edit',
      });
      expect(editResult.error).toBeFalsy();
      expect(editResult.data).toBeTruthy();
      expect(editResult.data?.id).toBe(couponId);
    }
  });
});

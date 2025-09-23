import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import type { WcAdminCouponRequest } from '../../../types/admin/coupon.types.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';

describe('Integration: Admin Coupon Service', () => {
  beforeAll(async () => {
    // Initialize SDK with admin authentication for admin operations
    // Note: StoreSdk.init() requires store access even for admin-only operations
    await StoreSdk.init({
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
    const { data, error, total, totalPages } =
      await StoreSdk.admin.coupons.list({
        per_page: 5,
        page: 1,
      });

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
    const { data, error } = await StoreSdk.admin.coupons.list({
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
    const testCouponData: WcAdminCouponRequest = {
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
    const createResult = await StoreSdk.admin.coupons.create(testCouponData);
    expect(createResult.error).toBeFalsy();
    expect(createResult.data).toBeTruthy();

    if (!createResult.data) {
      throw new Error('Failed to create test coupon');
    }

    expect(createResult.data.code).toBe(testCouponData.code);
    expect(createResult.data.discount_type).toBe(testCouponData.discount_type);
    expect(createResult.data.amount).toBe(testCouponData.amount);

    // Retrieve the created coupon
    const getResult = await StoreSdk.admin.coupons.get(createResult.data.id);
    expect(getResult.error).toBeFalsy();
    expect(getResult.data).toBeTruthy();
    expect(getResult.data?.id).toBe(createResult.data.id);
    expect(getResult.data?.code).toBe(testCouponData.code);

    // Update the coupon
    const updateData: WcAdminCouponRequest = {
      amount: '15.00',
      description: 'Updated test coupon description',
    };

    const updateResult = await StoreSdk.admin.coupons.update(
      createResult.data.id,
      updateData
    );
    expect(updateResult.error).toBeFalsy();
    expect(updateResult.data).toBeTruthy();
    expect(updateResult.data?.amount).toBe('15.00');
    expect(updateResult.data?.description).toBe(updateData.description);

    // Delete the coupon (force delete to skip trash)
    const deleteResult = await StoreSdk.admin.coupons.delete(
      createResult.data.id,
      true
    );
    expect(deleteResult.error).toBeFalsy();
    expect(deleteResult.data).toBeTruthy();

    // Verify coupon is deleted
    const getDeletedResult = await StoreSdk.admin.coupons.get(
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

    const batchResult = await StoreSdk.admin.coupons.batch(batchData);
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
        StoreSdk.admin.coupons.delete(created1.id, true),
        StoreSdk.admin.coupons.delete(created2.id, true),
      ]);
    }
  });

  it('handles error cases gracefully', async () => {
    // Test getting non-existent coupon
    const nonExistentResult = await StoreSdk.admin.coupons.get(999999);
    expect(nonExistentResult.error).toBeTruthy();
    expect(nonExistentResult.error?.code).toMatch(/not_found|invalid/i);

    // Test creating coupon with invalid data
    const invalidCouponData: WcAdminCouponRequest = {
      code: '', // Empty code should be invalid
      discount_type: 'percent',
      amount: 'invalid_amount', // Invalid amount
    };

    const invalidCreateResult = await StoreSdk.admin.coupons.create(
      invalidCouponData
    );
    expect(invalidCreateResult.error).toBeTruthy();

    // Test updating non-existent coupon
    const invalidUpdateResult = await StoreSdk.admin.coupons.update(999999, {
      amount: '10',
    });
    expect(invalidUpdateResult.error).toBeTruthy();

    // Test deleting non-existent coupon
    const invalidDeleteResult = await StoreSdk.admin.coupons.delete(999999);
    expect(invalidDeleteResult.error).toBeTruthy();
  });

  it('retrieves coupon in different contexts', async () => {
    // First get list to find an existing coupon
    const listResult = await StoreSdk.admin.coupons.list({ per_page: 1 });
    expect(listResult.error).toBeFalsy();

    if (listResult.data && listResult.data.length > 0) {
      const couponId = listResult.data[0].id;

      // Test view context
      const viewResult = await StoreSdk.admin.coupons.get(couponId, {
        context: 'view',
      });
      expect(viewResult.error).toBeFalsy();
      expect(viewResult.data).toBeTruthy();
      expect(viewResult.data?.id).toBe(couponId);

      // Test edit context
      const editResult = await StoreSdk.admin.coupons.get(couponId, {
        context: 'edit',
      });
      expect(editResult.error).toBeFalsy();
      expect(editResult.data).toBeTruthy();
      expect(editResult.data?.id).toBe(couponId);
    }
  });
});

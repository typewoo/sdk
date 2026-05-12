import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminCouponSchema } from '../../../types/admin/coupons/coupon.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdCouponId = 0;

beforeAll(() => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });
});

afterAll(async () => {
  if (createdCouponId) {
    await sdk.admin.coupons.delete(createdCouponId, true);
  }
});

describe('Admin Coupon — integration', () => {
  it('creates a coupon and validates schema', async () => {
    const { data, error } = await sdk.admin.coupons.create({
      code: `test-coupon-${Date.now()}`,
      discount_type: 'percent',
      amount: '10',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdCouponId = data!.id;

    const parsed = AdminCouponSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists coupons and validates schema per item with pagination', async () => {
    const result = await sdk.admin.coupons.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminCouponSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }

    expect(result.pagination.total).toBeTypeOf('number');
    expect(result.pagination.totalPages).toBeTypeOf('number');
  });

  it('gets coupon by id and validates schema', async () => {
    const { data, error } = await sdk.admin.coupons.get(createdCouponId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCouponSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdCouponId);
  });

  it('updates coupon amount and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.coupons.update(createdCouponId, {
      amount: '20',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCouponSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(parseFloat(data?.amount ?? '0')).toBe(20);
  });

  it('returns error for invalid coupon id', async () => {
    const { data, error } = await sdk.admin.coupons.get(999999999);

    expect(data).toBeUndefined();
    expect(error?.code).toBe('woocommerce_rest_shop_coupon_invalid_id');
  });

  it('deletes the created coupon successfully', async () => {
    const { data, error } = await sdk.admin.coupons.delete(
      createdCouponId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCouponSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdCouponId = 0;
  });
});

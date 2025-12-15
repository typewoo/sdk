// We recommend installing an extension to run vitest tests.
import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import { GET_WP_URL } from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

const WP_URL = GET_WP_URL();
// Adjust these coupon codes to match seeded coupons if needed.
const VALID_COUPON = 'SUMMER10';
const INVALID_COUPON = 'NOPE123';

describe('Integration: Cart Coupons (graceful handling)', () => {
  beforeAll(async () => {
    await Typewoo.init({ baseUrl: WP_URL });
  });

  it('handles list coupons (likely empty) without error', async () => {
    const list = await Typewoo.store.cartCoupons.list();
    expect(list.error).toBeFalsy();
    expect(Array.isArray(list.data)).toBe(true);
  });

  it('gracefully rejects invalid coupon code', async () => {
    const before = await Typewoo.store.cartCoupons.list();
    const beforeCount = before.data?.length || 0;

    const applied = await Typewoo.store.cartCoupons.add(INVALID_COUPON);
    expect(applied.error).toBeTruthy();
    expect(applied.error?.code).toMatch(/coupon|invalid|woocommerce/i);
    const after = await Typewoo.store.cartCoupons.list();
    const afterCount = after.data?.length || 0;
    const stillAbsent = !(after.data || []).some(
      (c) => c.code?.toLowerCase() === INVALID_COUPON.toLowerCase(),
    );
    expect(stillAbsent).toBe(true);
    expect(afterCount).toBe(beforeCount);
  });

  it('applies a valid coupon (idempotent)', async () => {
    // First application via add()
    const firstAdd = await Typewoo.store.cartCoupons.add(VALID_COUPON);
    expect(firstAdd.error).toBeFalsy();

    // Verify present via list()
    const listAfterFirst = await Typewoo.store.cartCoupons.list();
    const occurrencesAfterFirst = (listAfterFirst.data || []).filter(
      (c) => c.code?.toLowerCase() === VALID_COUPON.toLowerCase(),
    ).length;
    expect(occurrencesAfterFirst).toBeGreaterThanOrEqual(1);

    // Duplicate application
    const secondAdd = await Typewoo.store.cartCoupons.add(VALID_COUPON);
    if (secondAdd.error) {
      expect(secondAdd.error.code).toMatch(/already|exists|duplicate|coupon/i);
    }
    const listAfterSecond = await Typewoo.store.cartCoupons.list();
    const occurrencesAfterSecond = (listAfterSecond.data || []).filter(
      (c) => c.code?.toLowerCase() === VALID_COUPON.toLowerCase(),
    ).length;
    expect(occurrencesAfterSecond).toBeLessThanOrEqual(
      Math.max(1, occurrencesAfterFirst),
    );
  });

  it('removes an applied coupon', async () => {
    // Ensure applied
    const addResult = await Typewoo.store.cartCoupons.add(VALID_COUPON);
    if (addResult.error) {
      // Accept "already applied" style errors as idempotent success
      expect(addResult.error.code).toMatch(/already|exists|applied|coupon/i);
    }
    const withCoupon = await Typewoo.store.cartCoupons.list();
    const present = (withCoupon.data || []).some(
      (c) => c.code?.toLowerCase() === VALID_COUPON.toLowerCase(),
    );
    expect(present).toBe(true);

    // Remove
    const removed = await Typewoo.store.cartCoupons.delete(VALID_COUPON);
    expect(removed.error).toBeFalsy();
    const afterList = await Typewoo.store.cartCoupons.list();
    const stillPresent = (afterList.data || []).some(
      (c) => c.code?.toLowerCase() === VALID_COUPON.toLowerCase(),
    );
    expect(stillPresent).toBe(false);
  });

  it('removing a non-existent coupon provides error or silent success', async () => {
    const result = await Typewoo.store.cartCoupons.delete('NOT_IN_CART_123');
    expect(result.error?.code).toMatch(/invalid|not|coupon/i);
    const refreshed = await Typewoo.store.cartCoupons.list();
    expect(refreshed.error).toBeFalsy();
    expect(Array.isArray(refreshed.data)).toBe(true);
  });

  it('cart coupons array remains an array after multiple operations', async () => {
    const initial = await Typewoo.store.cartCoupons.list();
    expect(initial.error).toBeFalsy();
    await Typewoo.store.cartCoupons.add(INVALID_COUPON); // expect error via ApiResult
    const invalidAdd = await Typewoo.store.cartCoupons.add(INVALID_COUPON);
    expect(invalidAdd.error).toBeTruthy();
    expect(invalidAdd.error?.code).toMatch(/coupon|invalid|woocommerce/i);
    await Typewoo.store.cartCoupons.add(VALID_COUPON);
    await Typewoo.store.cartCoupons.delete(VALID_COUPON);
    const finalList = await Typewoo.store.cartCoupons.list();
    expect(finalList.error).toBeFalsy();
    expect(Array.isArray(finalList.data)).toBe(true);
  });
});

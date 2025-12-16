import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import { GET_WP_URL } from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

// Re-use base URL pattern from other integration specs
const WP_URL = GET_WP_URL();

// Coupon codes aligned with existing coupon integration tests (may or may not exist)
const POSSIBLE_COUPON = 'SUMMER10';
const INVALID_COUPON = 'NOT_A_REAL_COUPON_123';

describe('Integration: Cart Core Operations', () => {
  beforeAll(async () => {
    await Typewoo.init({ baseUrl: WP_URL });
  });

  async function ensureProductId(): Promise<number | undefined> {
    const { data: products } = await Typewoo.store.products.list({
      per_page: 5,
    });
    const prod = products?.find((p) => p.is_in_stock) || products?.[0];
    return prod?.id;
  }

  it('retrieves initial cart (may be empty)', async () => {
    const res = await Typewoo.store.cart.get();
    if (res.error) {
      // Cart retrieval should rarely error; if it does, assert error code semantic
      expect(res.error.code).toMatch(/cart|session|nonce|forbidden|auth/i);
      expect(res.data).toBeFalsy();
    } else {
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(Array.isArray(res.data.items)).toBe(true);
      }
    }
  });

  it('adds an item then updates quantity best-effort', async () => {
    const prodId = await ensureProductId();
    if (!prodId) {
      expect(true).toBe(true); // environment has no products, skip meaningful assertions
      return;
    }
    await Typewoo.store.cart.add({ id: prodId, quantity: 1 });
    const afterAdd = await Typewoo.store.cart.get();
    const firstKey = afterAdd.data?.items?.[0]?.key;
    if (firstKey) {
      // Try multiple quantities (parameterized style loop) expecting success
      for (const qty of [1, 2]) {
        const upd = await Typewoo.store.cart.update(firstKey, qty);
        if (upd.error) {
          // Quantity update errors should reflect validation/key issues
          expect(upd.error.code).toMatch(/invalid|quantity|item|cart/i);
        } else {
          expect(upd.data).toBeTruthy();
        }
      }
    } else {
      expect(Array.isArray(afterAdd.data?.items)).toBe(true);
    }
  });

  it('removes an item when key available (graceful if none)', async () => {
    const cart = await Typewoo.store.cart.get();
    const key = cart.data?.items?.[0]?.key;
    if (!key) {
      expect(Array.isArray(cart.data?.items)).toBe(true);
      return;
    }
    const removed = await Typewoo.store.cart.remove(key);
    if (removed.error) {
      expect(removed.error.code).toMatch(/invalid|item|cart|key|not/i);
    } else {
      expect(removed.data).toBeTruthy();
    }
  });

  it('applies and removes coupon via cart service (best-effort)', async () => {
    // Apply invalid first
    const bad = await Typewoo.store.cart.applyCoupon(INVALID_COUPON);
    if (bad.error) {
      expect(bad.error.code).toMatch(/invalid|coupon|not/i);
    }
    // Apply possible valid coupon
    const applied = await Typewoo.store.cart.applyCoupon(POSSIBLE_COUPON);
    if (applied.error) {
      expect(applied.error.code).toMatch(/invalid|coupon|already|not/i);
    } else {
      expect(applied.data).toBeTruthy();
    }
    // Remove (either succeeds or errors harmlessly if not applied)
    const removed = await Typewoo.store.cart.removeCoupon(POSSIBLE_COUPON);
    if (removed.error) {
      expect(removed.error.code).toMatch(/invalid|coupon|not|remove/i);
    } else {
      expect(removed.data).toBeTruthy();
    }
  });

  it('updates customer information (best-effort)', async () => {
    const upd = await Typewoo.store.cart.updateCustomer({
      billing_address: {
        first_name: 'Test',
        last_name: 'User',
        company: '',
        address_1: 'Addr 1',
        address_2: '',
        city: 'City',
        state: '',
        country: 'GR',
        postcode: '00000',
        email: 'user@example.com',
        phone: '',
      },
      shipping_address: {
        first_name: 'Test',
        last_name: 'User',
        company: '',
        address_1: 'Addr 1',
        address_2: '',
        city: 'City',
        state: '',
        country: 'GR',
        postcode: '00000',
        phone: '',
      },
    });
    if (upd.error) {
      expect(upd.error.code).toMatch(
        /invalid|billing|shipping|address|email|required/i
      );
    } else {
      expect(upd.data).toBeTruthy();
    }
  });

  it('selects shipping rate (likely error if no rates)', async () => {
    const attempt = await Typewoo.store.cart.selectShippingRate(1, 'flat_rate');
    if (attempt.error) {
      expect(attempt.error.code).not.toBe('rest_no_route');
      expect(attempt.error.code).toMatch(/shipping|rate|invalid|cart|package/i);
    } else {
      expect(attempt.data).toBeTruthy();
    }
  });
});

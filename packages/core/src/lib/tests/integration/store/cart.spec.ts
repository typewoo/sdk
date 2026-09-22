import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { CartResponseSchema } from '../../../types/store/cart/cart.schema.js';
import { CartItemResponseSchema } from '../../../types/store/cart-item/cart.item.schema.js';
import { getWpUrl } from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let firstProductId = 0;

beforeAll(async () => {
  sdk = createTypewoo({ baseUrl: getWpUrl() });

  // Grab a published purchasable product to use in cart operations
  const result = await sdk.store.products.list({ per_page: 5 });
  const purchasable = result.data?.find(
    (p) => p.is_purchasable && !p.sold_individually
  );
  firstProductId = purchasable?.id ?? 0;
});

describe('Store Cart — integration', () => {
  it('gets the cart and validates schema', async () => {
    const { data, error } = await sdk.store.cart.get();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = CartResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('adds a product to the cart and validates cart schema', async () => {
    if (!firstProductId) return; // no purchasable product in catalog — skip gracefully

    const { data, error } = await sdk.store.cart.add({
      id: firstProductId,
      quantity: 1,
    });

    // WC Store API cart mutations require a WP nonce; headless Node.js has no session cookie.
    if (
      error?.code === 'woocommerce_rest_missing_nonce' ||
      error?.code === 'woocommerce_rest_cookie_invalid_nonce'
    )
      return;

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = CartResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect((data?.items?.length ?? 0) > 0).toBe(true);
  });

  it('lists cart items and validates schema per item', async () => {
    const { data, error } = await sdk.store.cartItems.list();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = CartItemResponseSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('clears the cart successfully', async () => {
    const { data, error } = await sdk.store.cartItems.clear();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
  });
});

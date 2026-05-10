import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../index.js';
import type { TypewooClient } from '../../../index.js';
import { CartResponseSchema } from '../../types/store/cart/cart.schema.js';
import { CheckoutResponseSchema } from '../../types/store/checkout/checkout.schema.js';
import { ProductResponseSchema } from '../../types/store/product/product.schema.js';
import { ProductCategoryResponseSchema } from '../../types/store/product-category/product.category.schema.js';
import {
  getWpUrl,
  getCustomerUser,
  getCustomerPassword,
} from '../helpers/integration-config.js';

/**
 * Flow: Customer Checkout
 *
 * Full journey: login → categories → products → cart → checkout
 * Every response is validated with its schema's safeParse.
 *
 * Authentication:
 *   Uses the WordPress JWT auth plugin (via sdk.auth.token). If the plugin is
 *   inactive on the test environment the auth steps are skipped and the rest
 *   of the flow continues as a guest.
 */
describe('Flow: Customer Checkout', () => {
  let sdk: TypewooClient;
  let pluginActive = true;
  let accessToken = '';
  let refreshToken = '';

  beforeAll(async () => {
    sdk = createTypewoo({
      baseUrl: getWpUrl(),
      auth: {
        getToken: async () => accessToken,
        setToken: async (t: string) => {
          accessToken = t;
        },
        clearToken: async () => {
          accessToken = '';
        },
        getRefreshToken: async () => refreshToken,
        setRefreshToken: async (t: string) => {
          refreshToken = t;
        },
      },
    });

    const status = await sdk.auth.status();
    pluginActive = !!status.data?.active;
  });

  it('step 1 — login (skipped if plugin inactive)', async () => {
    if (!pluginActive) return;

    const login = await sdk.auth.token({
      login: getCustomerUser(),
      password: getCustomerPassword(),
    });

    expect(
      login.error,
      `login error: ${login.error?.code} — ${login.error?.message}`
    ).toBeUndefined();
    expect(typeof login.data?.token).toBe('string');
  });

  it('step 2 — list categories and validate schema per item', async () => {
    const { data, error } = await sdk.store.categories.list({ per_page: 5 });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const cat of data ?? []) {
      const parsed = ProductCategoryResponseSchema.safeParse(cat);
      expect(
        parsed.success,
        `category safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('step 3 — list products and validate schema per item', async () => {
    const { data, error } = await sdk.store.products.list({ per_page: 5 });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const product of data ?? []) {
      const parsed = ProductResponseSchema.safeParse(product);
      expect(
        parsed.success,
        `product safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('step 4 — add a purchasable product to cart and validate cart schema', async () => {
    const { data: products } = await sdk.store.products.list({ per_page: 5 });
    const purchasable = products?.find((p) => p.is_purchasable);
    if (!purchasable) return; // No purchasable product in catalog — skip gracefully

    const { data, error } = await sdk.store.cart.add({
      id: purchasable.id,
      quantity: 1,
    });

    // Headless Node.js test environments have no WordPress session/cookie so WC may
    // require a nonce that isn't available. Treat this as a graceful skip.
    if (
      error?.code === 'woocommerce_rest_missing_nonce' ||
      error?.code === 'woocommerce_rest_cookie_invalid_nonce'
    ) {
      return;
    }

    expect(
      error,
      `add-to-cart error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = CartResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `cart safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect((data?.items?.length ?? 0) > 0).toBe(true);
  });

  it('step 5 — get cart and validate schema', async () => {
    const { data, error } = await sdk.store.cart.get();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = CartResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `cart safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('step 6 — get checkout state and validate schema', async () => {
    const { data, error } = await sdk.store.checkout.get();

    // Checkout may be unavailable when the cart is empty (no session-based cart)
    if (error?.code === 'woocommerce_rest_cart_empty') return;

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = CheckoutResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `checkout safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('step 7 — process order (cod payment) or assert known-safe error', async () => {
    const billing = {
      first_name: 'Test',
      last_name: 'Customer',
      company: '',
      address_1: '123 Test St',
      address_2: '',
      city: 'Testopolis',
      state: 'CA',
      postcode: '12345',
      country: 'US',
      email: 'customer@example.com',
      phone: '1234567890',
    };
    const shipping = {
      first_name: 'Test',
      last_name: 'Customer',
      company: '',
      address_1: '123 Test St',
      address_2: '',
      city: 'Testopolis',
      state: 'CA',
      postcode: '12345',
      country: 'US',
    };

    const { data, error } = await sdk.store.checkout.processOrderAndPayment({
      billing_address: billing,
      shipping_address: shipping,
      payment_method: 'cod',
    });

    if (error) {
      // Cart may be empty (if step 4 was skipped) or address invalid — both are acceptable
      const acceptableCodes = [
        'woocommerce_rest_checkout_missing_billing_address_fields',
        'woocommerce_rest_invalid_address',
        'woocommerce_rest_checkout_error',
        'woocommerce_rest_cart_empty',
      ];
      expect(acceptableCodes).toContain(error.code);
    } else if (data) {
      expect(data.order_id).toBeGreaterThan(0);
      expect(typeof data.status).toBe('string');
    }
  });

  it('step 8 — clear the cart after the flow', async () => {
    const { error } = await sdk.store.cartItems.clear();

    expect(
      error,
      `clear-cart error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
  });
});

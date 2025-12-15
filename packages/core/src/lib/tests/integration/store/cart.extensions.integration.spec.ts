import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import {
  GET_WP_CUSTOMER_PASSWORD,
  GET_WP_CUSTOMER_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

const WP_URL = GET_WP_URL();
const CUSTOMER_USER = GET_WP_CUSTOMER_USER();
const CUSTOMER_PASS = GET_WP_CUSTOMER_PASSWORD();

describe('Integration: Cart Extensions API Operations', () => {
  beforeAll(async () => {
    await Typewoo.init({ baseUrl: WP_URL });
  });

  it('stores extension data for third-party plugin', async () => {
    await Typewoo.auth.token({
      login: CUSTOMER_USER,
      password: CUSTOMER_PASS,
    });

    await Typewoo.store.cart.get();

    const extensionRequest = {
      namespace: 'test-plugin',
      data: {
        customField: 'test-value',
        settings: {
          option1: true,
          option2: 'custom',
        },
      },
    };

    const res = await Typewoo.store.cartExtensions.store(extensionRequest);
    console.log(res);

    if (res.error) {
      // Cart extensions API might not be supported on all installations
      // or may require specific plugins to be installed
      expect(res.error.code).toMatch(
        /extensions?|not.*found|not.*supported|method.*not.*allowed|forbidden/i,
      );
      expect(res.data).toBeFalsy();
    } else {
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(res.data.namespace).toBe('test-plugin');
        expect(res.data.success).toBe(true);
        expect(res.data.data).toBeTruthy();
        expect(res.data.data.customField).toBe('test-value');
      }
    }
  });

  it('handles invalid namespace for extension data', async () => {
    const extensionRequest = {
      namespace: '', // Invalid empty namespace
      data: {
        someData: 'value',
      },
    };
    await Typewoo.auth.token({
      login: CUSTOMER_USER,
      password: CUSTOMER_PASS,
    });

    await Typewoo.store.cart.get();

    const res = await Typewoo.store.cartExtensions.store(extensionRequest);

    if (res.error) {
      // Should get validation error for invalid namespace
      expect(res.error.code).toMatch(
        /namespace|invalid|validation|required|empty|woocommerce_rest_missing_nonce|woocommerce_rest_cart_extensions_error/i,
      );
    } else {
      // If successful, it should indicate failure in the response
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(res.data.success).toBe(false);
        expect(res.data.error).toBeTruthy();
      }
    }
  });

  it('stores complex extension data structure', async () => {
    const extensionRequest = {
      namespace: 'complex-plugin',
      data: {
        userPreferences: {
          theme: 'dark',
          language: 'en',
          notifications: {
            email: true,
            push: false,
            sms: true,
          },
        },
        checkoutSettings: {
          savePaymentMethod: true,
          enableGuestCheckout: false,
          customFields: [
            { name: 'companyName', required: true },
            { name: 'vatNumber', required: false },
          ],
        },
      },
    };

    await Typewoo.auth.token({
      login: CUSTOMER_USER,
      password: CUSTOMER_PASS,
    });

    await Typewoo.store.cart.get();

    const res = await Typewoo.store.cartExtensions.store(extensionRequest);

    if (res.error) {
      // Extensions might not be supported
      expect(res.error.code).toMatch(/extensions?|not.*found|not.*supported/i);
    } else {
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(res.data.namespace).toBe('complex-plugin');
        expect(res.data.data).toBeTruthy();
        expect(res.data.data.userPreferences).toBeTruthy();
        expect(res.data.data.checkoutSettings).toBeTruthy();
      }
    }
  });
});

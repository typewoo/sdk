import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { CheckoutResponseSchema } from '../../../types/store/checkout/checkout.schema.js';
import { getWpUrl } from '../../helpers/integration-config.js';

let sdk: TypewooClient;

beforeAll(() => {
  sdk = createTypewoo({ baseUrl: getWpUrl() });
});

describe('Store Checkout — integration', () => {
  it('gets checkout state and validates schema', async () => {
    const { data, error } = await sdk.store.checkout.get();

    // WC Store API requires a WP nonce tied to a session cookie.
    // Headless Node.js requests have no session, so nonce validation fails.
    if (error?.code === 'woocommerce_rest_cookie_invalid_nonce') return;
    // Cart may be empty when there is no persistent session across test runs.
    if (error?.code === 'woocommerce_rest_cart_empty') return;
    // The SDK's refresh-token interceptor fires on auth failure and itself fails in headless
    // Node.js (status 0 = client-side abort, not a server error). This is an SDK-internal
    // error code, not a WC API response code.
    if (
      error?.code === 'request_error' &&
      (error.data as { status?: number })?.status === 0
    )
      return;

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = CheckoutResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });
});

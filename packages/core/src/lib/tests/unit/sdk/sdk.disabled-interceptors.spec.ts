import { describe, it, expect } from 'vitest';
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { createTypewoo } from '../../../sdk.js';

/**
 * A fake transport: every response carries a nonce and a cart token, as the
 * Store API's does, and every request's headers are recorded.
 */
function fakeServer() {
  const sent: InternalAxiosRequestConfig['headers'][] = [];
  const adapter: AxiosAdapter = async (config) => {
    sent.push(config.headers);
    return {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: { nonce: 'server-nonce', 'cart-token': 'server-cart-token' },
      config,
    };
  };
  return { adapter, sent };
}

describe('disabled nonce and cart-token interceptors', () => {
  it('neither keep nor send what the server returns', async () => {
    const { adapter, sent } = fakeServer();
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      axiosConfig: { adapter },
      auth: { accessToken: { disabled: true } },
      nonce: { disabled: true },
      cartToken: { disabled: true },
    });

    await sdk.http.get('/wp-json/wc/store/v1/cart');
    await sdk.http.get('/wp-json/wc/store/v1/cart');

    expect(sdk.state.nonce).toBeUndefined();
    expect(sdk.state.cartToken).toBeUndefined();
    expect(sent[1]?.['nonce']).toBeUndefined();
    expect(sent[1]?.['cart-token']).toBeUndefined();
  });

  it('keep and send back what the server returns when not disabled', async () => {
    const { adapter, sent } = fakeServer();
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      axiosConfig: { adapter },
      auth: { accessToken: { disabled: true } },
      nonce: { storage: 'memory' },
      cartToken: { storage: 'memory' },
    });

    await sdk.http.get('/wp-json/wc/store/v1/cart');
    await sdk.http.get('/wp-json/wc/store/v1/cart');

    expect(sdk.state.nonce).toBe('server-nonce');
    expect(sdk.state.cartToken).toBe('server-cart-token');
    expect(sent[1]?.['nonce']).toBe('server-nonce');
    expect(sent[1]?.['cart-token']).toBe('server-cart-token');
  });
});

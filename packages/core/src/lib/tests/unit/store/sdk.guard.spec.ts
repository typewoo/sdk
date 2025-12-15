import { describe, it, expect, vi } from 'vitest';
import { Sdk } from '../../../sdk.js';
import type { SdkConfig } from '../../../configs/sdk.config.js';
import { createHttpClient } from '../../../http/http.client.js';

describe('Sdk guards', () => {
  it('throws when accessing store before init', () => {
    const sdk = new Sdk();
    expect(() => sdk.store).toThrow(/SDK not initialized/);
  });

  it('second init call is a no-op', async () => {
    const sdk = new Sdk();
    // mock dependencies
    vi.mock('../../services/store.service.js', () => ({
      StoreService: vi
        .fn()
        .mockImplementation(() => ({ cart: { get: vi.fn() } })),
    }));
    vi.mock('../../interceptors/cart.token.interceptor.js', () => ({
      addCartTokenInterceptors: vi.fn(),
    }));
    vi.mock('../../interceptors/nonce.interceptor.js', () => ({
      addNonceInterceptors: vi.fn(),
    }));
    createHttpClient({ baseURL: 'https://example.test' });
    const config: SdkConfig = {
      baseUrl: 'https://example.test',
    } as SdkConfig;
    await sdk.init(config);
    // Spy on internal store.cart.get to ensure not invoked twice
    const firstStore = sdk.store as unknown as {
      cart: { get: () => Promise<void> };
    };
    const getSpy = vi.spyOn(firstStore.cart, 'get');
    await sdk.init(config); // should early-return
    expect(getSpy).not.toHaveBeenCalled();
  });
});

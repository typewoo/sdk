import { describe, it, expect, vi } from 'vitest';
import { createTypewoo, TypewooClient } from '../../../sdk.js';

vi.mock('../../../http/http.client.js', () => ({
  createHttpClient: vi.fn(),
  httpClient: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));
vi.mock('../../../interceptors/cart.token.interceptor.js', () => ({
  addCartTokenInterceptors: vi.fn(),
}));
vi.mock('../../../interceptors/nonce.interceptor.js', () => ({
  addNonceInterceptors: vi.fn(),
}));
vi.mock('../../../interceptors/token.interceptor.js', () => ({
  addTokenInterceptor: vi.fn(),
}));
vi.mock('../../../interceptors/refresh.token.interceptor.js', () => ({
  addRefreshTokenInterceptor: vi.fn(),
}));
vi.mock('../../../interceptors/admin-auth.interceptor.js', () => ({
  addAdminAuthInterceptor: vi.fn(),
}));

describe('createTypewoo()', () => {
  it('returns a TypewooClient instance', () => {
    const sdk = createTypewoo({ baseUrl: 'https://store.test' });
    expect(sdk).toBeInstanceOf(TypewooClient);
  });

  it('exposes store, admin, analytics services', () => {
    const sdk = createTypewoo({ baseUrl: 'https://store.test' });
    expect(sdk.store).toBeDefined();
    expect(sdk.admin).toBeDefined();
    expect(sdk.analytics).toBeDefined();
  });

  it('resolves baseUrl into config', () => {
    const sdk = createTypewoo({ baseUrl: 'https://custom.test' });
    expect(sdk.config.baseUrl).toBe('https://custom.test');
  });

  it('generates a uniqueIdentifier when not provided', () => {
    const sdk = createTypewoo({ baseUrl: 'https://store.test' });
    expect(typeof sdk.config.uniqueIdentifier).toBe('string');
    expect(sdk.config.uniqueIdentifier.length).toBeGreaterThan(0);
  });

  it('uses provided uniqueIdentifier string', () => {
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      uniqueIdentifier: 'my-sdk',
    });
    expect(sdk.config.uniqueIdentifier).toBe('my-sdk');
  });

  it('calls uniqueIdentifier function when provided as factory', () => {
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      uniqueIdentifier: () => 'dynamic-id',
    });
    expect(sdk.config.uniqueIdentifier).toBe('dynamic-id');
  });

  it('exposes auth service', () => {
    const sdk = createTypewoo({ baseUrl: 'https://store.test' });
    expect(sdk.auth).toBeDefined();
  });

  it('wires admin consumer credentials into config', () => {
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      admin: { consumer_key: 'ck_test', consumer_secret: 'cs_test' },
    });
    expect(sdk.config.admin?.consumer_key).toBe('ck_test');
    expect(sdk.config.admin?.consumer_secret).toBe('cs_test');
  });

  it('setUniqueIdentifier updates the config', () => {
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      uniqueIdentifier: 'original',
    });
    sdk.setUniqueIdentifier('updated');
    expect(sdk.config.uniqueIdentifier).toBe('updated');
  });
});

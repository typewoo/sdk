import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTypewoo, TypewooClient } from '../../../sdk.js';
import type {
  SdkConfig,
  CustomEndpoints,
} from '../../../configs/sdk.config.js';
import { memoryStorageProvider } from '../../../storage/auth.storage.js';

// Mock the HTTP client and interceptors to isolate SDK init tests
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
  describe('basic initialization', () => {
    it('should return a TypewooClient instance', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk).toBeInstanceOf(TypewooClient);
    });

    it('should create SDK with minimal config', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://mystore.com',
      });

      expect(sdk.config.baseUrl).toBe('https://mystore.com');
    });

    it('should expose store service', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk.store).toBeDefined();
      expect(sdk.store.products).toBeDefined();
      expect(sdk.store.cart).toBeDefined();
    });

    it('should expose auth service', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk.auth).toBeDefined();
    });

    it('should expose admin service', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk.admin).toBeDefined();
    });

    it('should expose events bus', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk.events).toBeDefined();
      expect(typeof sdk.events.on).toBe('function');
      expect(typeof sdk.events.emit).toBe('function');
    });

    it('should expose state object', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk.state).toBeDefined();
      expect(typeof sdk.state).toBe('object');
    });
  });

  describe('multiple instances', () => {
    it('should allow creating multiple independent instances', () => {
      const sdk1 = createTypewoo({
        baseUrl: 'https://store1.com',
      });

      const sdk2 = createTypewoo({
        baseUrl: 'https://store2.com',
      });

      expect(sdk1).not.toBe(sdk2);
      expect(sdk1.config.baseUrl).toBe('https://store1.com');
      expect(sdk2.config.baseUrl).toBe('https://store2.com');
    });

    it('should have independent state per instance', () => {
      const sdk1 = createTypewoo({
        baseUrl: 'https://store1.com',
      });

      const sdk2 = createTypewoo({
        baseUrl: 'https://store2.com',
      });

      sdk1.state.authenticated = true;
      sdk2.state.authenticated = false;

      expect(sdk1.state.authenticated).toBe(true);
      expect(sdk2.state.authenticated).toBe(false);
    });

    it('should have independent event buses per instance', () => {
      const sdk1 = createTypewoo({
        baseUrl: 'https://store1.com',
      });

      const sdk2 = createTypewoo({
        baseUrl: 'https://store2.com',
      });

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      sdk1.events.on('auth:changed', handler1);
      sdk2.events.on('auth:changed', handler2);

      sdk1.events.emit('auth:changed', true);

      expect(handler1).toHaveBeenCalledWith(true);
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('configuration options', () => {
    it('should resolve storage providers from strings', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: 'memory',
          },
        },
      });

      expect(sdk.config.auth?.accessToken?.storage?.type).toBe('memory');
    });

    it('should accept custom StorageProvider', () => {
      const customProvider = memoryStorageProvider('custom_key');

      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: customProvider,
          },
        },
      });

      expect(sdk.config.auth?.accessToken?.storage).toBe(customProvider);
    });

    it('should configure admin credentials', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        admin: {
          consumer_key: 'ck_test',
          consumer_secret: 'cs_test',
        },
      });

      expect(sdk.config.admin?.consumer_key).toBe('ck_test');
      expect(sdk.config.admin?.consumer_secret).toBe('cs_test');
    });

    it('should pass axiosConfig to resolved config', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        axiosConfig: {
          timeout: 5000,
          headers: {
            'X-Custom-Header': 'test',
          },
        },
      });

      expect(sdk.config.axiosConfig?.timeout).toBe(5000);
      expect(sdk.config.axiosConfig?.headers).toEqual({
        'X-Custom-Header': 'test',
      });
    });

    it('should configure cart token storage', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        cartToken: {
          key: 'my_cart_token',
          storage: 'memory',
        },
      });

      expect(sdk.config.cartToken?.key).toBe('my_cart_token');
      expect(sdk.config.cartToken?.storage?.type).toBe('memory');
    });

    it('should configure nonce storage', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        nonce: {
          key: 'my_nonce',
          storage: 'memory',
        },
      });

      expect(sdk.config.nonce?.key).toBe('my_nonce');
      expect(sdk.config.nonce?.storage?.type).toBe('memory');
    });
  });

  describe('auth configuration', () => {
    it('should configure fetchCartOnLogin option', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          fetchCartOnLogin: true,
        },
      });

      expect(sdk.config.auth?.fetchCartOnLogin).toBe(true);
    });

    it('should configure revokeTokenBeforeLogin option', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          revokeTokenBeforeLogin: true,
        },
      });

      expect(sdk.config.auth?.revokeTokenBeforeLogin).toBe(true);
    });

    it('should configure autoLoginUrl', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          autoLoginUrl: '/custom/auto-login',
        },
      });

      expect(sdk.config.auth?.autoLoginUrl).toBe('/custom/auto-login');
    });

    it('should not initialize auth when accessToken disabled', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            disabled: true,
          },
        },
      });

      // When accessToken is disabled, auth is not initialized
      expect(sdk.config.auth).toBeUndefined();
    });

    it('should not initialize refreshToken when disabled', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          refreshToken: {
            disabled: true,
          },
        },
      });

      // Auth is still initialized, but refreshToken is not
      expect(sdk.config.auth).toBeDefined();
      expect(sdk.config.auth?.accessToken).toBeDefined();
      expect(sdk.config.auth?.refreshToken).toBeUndefined();
    });

    it('should configure useInterceptor flags', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            useInterceptor: false,
          },
          refreshToken: {
            useInterceptor: false,
          },
        },
      });

      expect(sdk.config.auth?.accessToken?.useInterceptor).toBe(false);
      expect(sdk.config.auth?.refreshToken?.useInterceptor).toBe(false);
    });
  });
});

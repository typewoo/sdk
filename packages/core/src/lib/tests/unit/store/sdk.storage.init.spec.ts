import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Sdk } from '../../../sdk.js';
import { SdkConfig } from '../../../configs/sdk.config.js';
import { memoryStorageProvider } from '../../../utilities/storage.providers.js';

// Mock the HTTP client and interceptors to isolate SDK init tests
vi.mock('../../../services/api.js', () => ({
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

describe('SDK Storage Provider Resolution', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('accessToken storage resolution', () => {
    it('should resolve default storage when not specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
      };

      await sdk.init(config);

      // Storage should be resolved (falls back to memory in Node.js)
      const resolvedStorage = sdk.config.auth?.accessToken?.storage;
      expect(resolvedStorage).toBeDefined();
      expect(typeof resolvedStorage?.get).toBe('function');
      expect(typeof resolvedStorage?.set).toBe('function');
      expect(typeof resolvedStorage?.clear).toBe('function');
    });

    it('should resolve "memory" string to memory provider', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: 'memory',
          },
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.auth?.accessToken?.storage;
      expect(resolvedStorage?.type).toBe('memory');
    });

    it('should use custom key when specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            key: 'custom_access_token_key',
            storage: 'memory',
          },
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.auth?.accessToken?.storage;
      expect(resolvedStorage).toBeDefined();
    });

    it('should use custom StorageProvider when provided', async () => {
      const customProvider = memoryStorageProvider();
      await customProvider.set('pre-existing-token');

      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: customProvider,
          },
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.auth?.accessToken?.storage;
      expect(resolvedStorage).toBe(customProvider);
      expect(await resolvedStorage?.get()).toBe('pre-existing-token');
    });

    it('should not resolve storage when disabled', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            disabled: true,
          },
        },
      };

      await sdk.init(config);

      // Storage should not be resolved when disabled
      const resolvedStorage = sdk.config.auth?.accessToken?.storage;
      expect(resolvedStorage).toBeUndefined();
    });
  });

  describe('refreshToken storage resolution', () => {
    it('should resolve default storage when not specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.auth?.refreshToken?.storage;
      expect(resolvedStorage).toBeDefined();
      expect(typeof resolvedStorage?.get).toBe('function');
    });

    it('should not resolve storage when accessToken is disabled', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            disabled: true,
          },
        },
      };

      await sdk.init(config);

      // refreshToken storage should not be resolved if accessToken is disabled
      const resolvedStorage = sdk.config.auth?.refreshToken?.storage;
      expect(resolvedStorage).toBeUndefined();
    });

    it('should not resolve storage when refreshToken is disabled', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          refreshToken: {
            disabled: true,
          },
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.auth?.refreshToken?.storage;
      expect(resolvedStorage).toBeUndefined();
    });

    it('should use custom key when specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          refreshToken: {
            key: 'my_refresh_token',
            storage: 'memory',
          },
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.auth?.refreshToken?.storage;
      expect(resolvedStorage).toBeDefined();
      expect(resolvedStorage?.type).toBe('memory');
    });
  });

  describe('cartToken storage resolution', () => {
    it('should resolve default storage when not specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.cartToken?.storage;
      expect(resolvedStorage).toBeDefined();
      expect(typeof resolvedStorage?.get).toBe('function');
    });

    it('should not resolve storage when disabled', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        cartToken: {
          disabled: true,
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.cartToken?.storage;
      expect(resolvedStorage).toBeUndefined();
    });

    it('should use custom key when specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        cartToken: {
          key: 'my_cart_token',
          storage: 'memory',
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.cartToken?.storage;
      expect(resolvedStorage).toBeDefined();
    });
  });

  describe('nonce storage resolution', () => {
    it('should resolve default storage when not specified', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.nonce?.storage;
      expect(resolvedStorage).toBeDefined();
      expect(typeof resolvedStorage?.get).toBe('function');
    });

    it('should not resolve storage when disabled', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        nonce: {
          disabled: true,
        },
      };

      await sdk.init(config);

      const resolvedStorage = sdk.config.nonce?.storage;
      expect(resolvedStorage).toBeUndefined();
    });
  });

  describe('initial authentication state', () => {
    it('should set authenticated to false when no token is stored', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: 'memory',
          },
        },
      };

      await sdk.init(config);

      expect(sdk.state.authenticated).toBe(false);
    });

    it('should set authenticated to true when token is stored', async () => {
      const customProvider = memoryStorageProvider();
      await customProvider.set('existing-token');

      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: customProvider,
          },
        },
      };

      await sdk.init(config);

      expect(sdk.state.authenticated).toBe(true);
    });

    it('should emit auth:changed event with correct value', async () => {
      const customProvider = memoryStorageProvider();
      await customProvider.set('existing-token');

      const sdk = new Sdk();
      const authChangedHandler = vi.fn();
      sdk.events.on('auth:changed', authChangedHandler);

      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: customProvider,
          },
        },
      };

      await sdk.init(config);

      expect(authChangedHandler).toHaveBeenCalledWith(true);
    });

    it('should not check auth state when accessToken is disabled', async () => {
      const sdk = new Sdk();
      const authChangedHandler = vi.fn();
      sdk.events.on('auth:changed', authChangedHandler);

      const config: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            disabled: true,
          },
        },
      };

      await sdk.init(config);

      // When accessToken is disabled, auth:changed should not be emitted
      // because there's no storage to check
      expect(authChangedHandler).not.toHaveBeenCalled();
    });
  });

  describe('SDK init idempotency', () => {
    it('should not re-initialize if already initialized', async () => {
      const sdk = new Sdk();
      const config: SdkConfig = {
        baseUrl: 'https://example.com',
      };

      await sdk.init(config);
      const firstStorage = sdk.config.auth?.accessToken?.storage;

      // Modify config and try to init again
      const newConfig: SdkConfig = {
        baseUrl: 'https://example.com',
        auth: {
          accessToken: {
            storage: memoryStorageProvider(),
          },
        },
      };

      await sdk.init(newConfig);

      // Storage should remain the same (not re-initialized)
      expect(sdk.config.auth?.accessToken?.storage).toBe(firstStorage);
    });
  });
});

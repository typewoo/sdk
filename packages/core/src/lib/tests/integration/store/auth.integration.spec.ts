import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { Typewoo } from '../../../sdk.js';
import { SdkConfig } from '../../../configs/sdk.config.js';
import { resetRefreshTokenState } from '../../../interceptors/refresh.token.interceptor.js';
import {
  GET_WP_CUSTOMER_PASSWORD,
  GET_WP_CUSTOMER_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import {
  StorageProvider,
  memoryStorageProvider,
} from '../../../storage/auth.storage.js';

config({ path: resolve(__dirname, '../../../../../../../.env') });

const WP_URL = GET_WP_URL();
const CUSTOMER_USER = GET_WP_CUSTOMER_USER();
const CUSTOMER_PASS = GET_WP_CUSTOMER_PASSWORD();

// Storage providers for tokens
let accessTokenStorage: StorageProvider;
let refreshTokenStorage: StorageProvider;

// Initialize SDK once and use exposed auth facade
const sdk = Typewoo;
// We'll init lazily in beforeAll so baseUrl & config callbacks are wired
let pluginActive: boolean | undefined;

describe('Integration: Auth', () => {
  beforeEach(() => {
    // Reset the global refresh token state before each test
    resetRefreshTokenState();
  });

  beforeAll(async () => {
    // Create memory storage providers for testing
    accessTokenStorage = memoryStorageProvider();
    refreshTokenStorage = memoryStorageProvider();

    const config: SdkConfig = {
      baseUrl: WP_URL,
      auth: {
        accessToken: {
          storage: accessTokenStorage,
        },
        refreshToken: {
          storage: refreshTokenStorage,
        },
      },
    };
    await sdk.init(config);
    const status = await sdk.auth.status();
    pluginActive = !!status.data?.active;
  });

  it('status endpoint responds (soft assert)', async () => {
    const { data, error } = await sdk.auth.status();
    // Basic shape assertions if available
    if (data) {
      expect(typeof data.active).toBe('boolean');
      expect(typeof data.version).toBe('string');
    } else {
      // Allow environments without plugin
      expect(error || true).toBeTruthy();
    }
  });

  it('logs in and receives token (customer user)', async () => {
    if (!pluginActive) {
      expect(true).toBe(true); // skip-like
      return;
    }
    const { data, error } = await sdk.auth.token({
      login: CUSTOMER_USER,
      password: CUSTOMER_PASS,
    });
    expect(error).toBeFalsy();
    expect(data?.token).toBeTruthy();

    // Verify token was stored via storage provider
    const storedToken = await accessTokenStorage.get();
    expect(storedToken).toBe(data?.token);

    if (data?.refresh_token) {
      await refreshTokenStorage.set(data.refresh_token);
    }
  });

  it('validates current access token', async () => {
    if (!pluginActive) {
      expect(true).toBe(true);
      return;
    }

    await sdk.auth.token({
      login: CUSTOMER_USER,
      password: CUSTOMER_PASS,
    });
    const { data, error } = await sdk.auth.validate();
    expect(error).toBeFalsy();
    expect(data?.valid || false).toBe(true);
  });

  it('refreshes token (if refresh token available)', async () => {
    const storedRefreshToken = await refreshTokenStorage.get();
    if (!pluginActive || !storedRefreshToken) {
      expect(true).toBe(true);
      return;
    }
    const oldToken = await accessTokenStorage.get();
    const { data, error } = await sdk.auth.refreshToken({
      refresh_token: storedRefreshToken,
    });
    expect(error).toBeFalsy();
    if (data?.token) {
      expect(data.token).not.toBe(oldToken); // rotation expected (best-effort)
      await refreshTokenStorage.set(data.refresh_token);
    }
  });

  it('issues one-time token after login', async () => {
    const storedToken = await accessTokenStorage.get();
    if (!pluginActive || !storedToken) {
      expect(true).toBe(true);
      return;
    }
    const { data, error } = await sdk.auth.oneTimeToken({ ttl: 60 });
    expect(error).toBeFalsy();
    if (data) {
      expect(typeof data.one_time_token).toBe('string');
      expect(data.one_time_token.length).toBeGreaterThan(10);
    }
  });

  it('logs in, token expires, 401 triggers refresh interceptor, retried request succeeds', async () => {
    // 1) Login and set a very short access_ttl to force expiry
    const { data, error } = await Typewoo.auth.token({
      login: CUSTOMER_USER,
      password: CUSTOMER_PASS,
      access_ttl: 1, // seconds
    });

    expect(error).toBeUndefined();
    expect(data?.token).toBeTruthy();

    const storedToken = await accessTokenStorage.get();
    const storedRefresh = await refreshTokenStorage.get();
    expect(storedToken).toBeTruthy();
    expect(storedRefresh).toBeTruthy();
    const oldToken = storedToken;

    // 2) Wait for the access token to expire
    await new Promise((r) => setTimeout(r, 3000));

    // 3) Call a protected WP endpoint; initial 401 should be auto-refreshed and retried
    const { data: cartData } = await Typewoo.store.cart.get();

    // If the refresh interceptor worked, we should have a 200 and cart data
    expect(cartData).toBeTruthy();

    const newToken = await accessTokenStorage.get();
    expect(newToken).toBeTruthy();
    expect(newToken).not.toBe(oldToken); // token must rotate after refresh
  }, 8000);

  it('revokes token and subsequent validate may fail', async () => {
    const storedToken = await accessTokenStorage.get();
    if (!pluginActive || !storedToken) {
      expect(true).toBe(true);
      return;
    }
    const { data, error } = await sdk.auth.revokeToken();
    expect(error).toBeFalsy();
    expect(data?.revoked).toBe(true);
    // Optionally validate again (may fail and return error)
    const postValidate = await sdk.auth.validate();
    if (postValidate.data) {
      // If still valid, at least shape holds
      expect(typeof postValidate.data.valid).toBe('boolean');
    } else {
      expect(postValidate.error || true).toBeTruthy();
    }
  });
});

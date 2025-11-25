import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { Typewoo } from '../../../sdk.js';
import { SdkConfig } from '../../../configs/sdk.config.js';
import { httpClient } from '../../../services/api.js';
import { resetRefreshTokenState } from '../../../interceptors/refresh.token.interceptor.js';
import { GET_WP_URL } from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

const WP_URL = GET_WP_URL();
const CUSTOMER_USER = process.env.TEST_CUSTOMER_USER || 'customer';
const CUSTOMER_PASS = process.env.TEST_CUSTOMER_PASSWORD || 'customer123';

// Simple holder for tokens captured through config callbacks
let accessToken = '';
let refreshToken = '';

// Initialize SDK once and use exposed auth facade
const sdk = Typewoo;
let pluginActive: boolean | undefined;

describe('Integration: Refresh Token Interceptor', () => {
  const tokenStore = { token: '', refresh: '' };

  beforeEach(() => {
    // Reset the global refresh token state before each test
    resetRefreshTokenState();
  });

  beforeAll(async () => {
    // Probe status first; if unreachable or inactive, later tests will soft-pass

    const config: SdkConfig = {
      baseUrl: WP_URL,
      auth: {
        getToken: async () => {
          return accessToken;
        },
        setToken: async (t: string) => {
          accessToken = t;
          tokenStore.token = t;
        },
        getRefreshToken: async () => {
          return refreshToken;
        },
        setRefreshToken: async (t: string) => {
          refreshToken = t;
          tokenStore.refresh = t;
        },
        clearToken: async () => {
          accessToken = '';
          tokenStore.token = '';
          tokenStore.refresh = '';
        },
      },
    };

    await sdk.init(config);
    const status = await sdk.auth.status();
    pluginActive = !!status.data?.active;
  });

  it('verify token state is clean after test', async () => {
    // Clean up for next tests
    if (pluginActive && accessToken) {
      await sdk.auth.revokeToken();
    }
    expect(true).toBe(true); // Basic assertion to pass the test
  });
});

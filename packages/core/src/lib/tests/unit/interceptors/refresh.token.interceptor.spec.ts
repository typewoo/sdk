import { describe, it, expect, vi, beforeEach } from 'vitest';
import { memoryStorageProvider } from '../../../storage/auth.storage.js';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';
import { EventBus } from '../../../bus/event.bus.js';
import type { SdkEvent } from '../../../sdk.events.js';

const { resUse } = vi.hoisted(() => ({ resUse: vi.fn() }));

vi.mock('../../../http/http.client.js', () => ({
  createHttpClient: vi.fn(),
  httpClient: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: resUse },
    },
  },
}));

// Provide a minimal mock for AuthService
vi.mock('../../../services/auth/auth.service.js', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    refreshToken: vi.fn().mockResolvedValue({
      data: { access_token: 'new-tok' },
      error: undefined,
    }),
  })),
}));

import {
  addRefreshTokenInterceptor,
  resetRefreshTokenState,
} from '../../../interceptors/refresh.token.interceptor.js';
import { AuthService } from '../../../services/auth/auth.service.js';

function makeConfig(overrides?: Partial<ResolvedSdkConfig>): ResolvedSdkConfig {
  return {
    baseUrl: 'https://store.test',
    uniqueIdentifier: 'test',
    request: { retry: { enabled: false } },
    ...overrides,
  } as ResolvedSdkConfig;
}

describe('refresh.token.interceptor', () => {
  beforeEach(() => {
    resUse.mockClear();
    resetRefreshTokenState();
  });

  it('passes through successful responses unchanged', async () => {
    const state = {};
    const events = new EventBus<SdkEvent>();
    const auth = new AuthService({} as never, {} as never, events);
    addRefreshTokenInterceptor(makeConfig(), auth, state, events);

    // The first handler passed to resUse is the success passthrough
    const [successHandler] = resUse.mock.calls[
      resUse.mock.calls.length - 1
    ] as [(r: unknown) => unknown];
    const response = { status: 200, data: { ok: true } };
    expect(successHandler(response)).toBe(response);
  });

  it('passes through 401 errors for non-store/typewoo URLs without retrying', async () => {
    const state = {};
    const events = new EventBus<SdkEvent>();
    const auth = new AuthService({} as never, {} as never, events);
    addRefreshTokenInterceptor(makeConfig(), auth, state, events);

    const [, errHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      unknown,
      (e: unknown) => Promise<unknown>
    ];
    const adminError = {
      config: { url: '/wp-json/wc/v3/products', _retry: false },
      response: { status: 401 },
    };
    await expect(errHandler(adminError)).rejects.toBe(adminError);
  });

  it('calls auth.refreshToken for 401 on store URL and rejects when refresh also fails', async () => {
    const refreshStorage = memoryStorageProvider();
    await refreshStorage.set('refresh-token-abc');

    const state = {};
    const events = new EventBus<SdkEvent>();
    const auth = new AuthService({} as never, {} as never, events);
    // Override mock to return an error so the interceptor doesn't try an actual HTTP retry
    vi.mocked(auth.refreshToken).mockResolvedValueOnce({
      data: undefined,
      error: {
        code: 'refresh_failed',
        message: 'Refresh failed',
        data: { status: 401 },
        details: {},
      },
    });

    addRefreshTokenInterceptor(
      makeConfig({ auth: { refreshToken: { storage: refreshStorage } } }),
      auth,
      state,
      events
    );

    const [, errHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      unknown,
      (e: unknown) => Promise<unknown>
    ];
    const storeError = {
      config: { url: '/wp-json/wc/store/v1/cart', _retry: false, headers: {} },
      response: { status: 401 },
    };

    await expect(errHandler(storeError)).rejects.toMatchObject({
      code: expect.any(String),
    });
    expect(vi.mocked(auth.refreshToken)).toHaveBeenCalled();
  });

  it('rejects with refresh_token_failed when no refresh token is in storage', async () => {
    const refreshStorage = memoryStorageProvider(); // empty
    const state = {};
    const events = new EventBus<SdkEvent>();
    const auth = new AuthService({} as never, {} as never, events);
    addRefreshTokenInterceptor(
      makeConfig({ auth: { refreshToken: { storage: refreshStorage } } }),
      auth,
      state,
      events
    );

    const [, errHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      unknown,
      (e: unknown) => Promise<unknown>
    ];
    const storeError = {
      config: { url: '/wp-json/wc/store/v1/cart', _retry: false, headers: {} },
      response: { status: 401 },
    };

    await expect(errHandler(storeError)).rejects.toMatchObject({
      code: 'refresh_token_failed',
    });
    expect(vi.mocked(auth.refreshToken)).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { memoryStorageProvider } from '../../../storage/auth.storage.js';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';
import type { InternalAxiosRequestConfig } from 'axios';

const { reqUse } = vi.hoisted(() => ({ reqUse: vi.fn() }));

vi.mock('../../../http/http.client.js', () => ({
  createHttpClient: vi.fn(),
  httpClient: {
    interceptors: {
      request: { use: reqUse },
      response: { use: vi.fn() },
    },
  },
}));

import { addTokenInterceptor } from '../../../interceptors/token.interceptor.js';

type FakeConfig = { url?: string; headers: Record<string, unknown> };

function makeConfig(overrides?: Partial<ResolvedSdkConfig>): ResolvedSdkConfig {
  return {
    baseUrl: 'https://store.test',
    uniqueIdentifier: 'test',
    request: { retry: { enabled: false } },
    ...overrides,
  } as ResolvedSdkConfig;
}

describe('token.interceptor', () => {
  beforeEach(() => {
    reqUse.mockClear();
  });

  it('adds Authorization Bearer header for Store API requests', async () => {
    const storage = memoryStorageProvider();
    await storage.set('jwt-token-abc');
    addTokenInterceptor(makeConfig({ auth: { accessToken: { storage } } }));

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/store/v1/cart',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['Authorization']).toBe(
      'Bearer jwt-token-abc'
    );
  });

  it('adds Authorization Bearer header for Typewoo API requests', async () => {
    const storage = memoryStorageProvider();
    await storage.set('jwt-token-typewoo');
    addTokenInterceptor(makeConfig({ auth: { accessToken: { storage } } }));

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/typewoo/v1/token',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['Authorization']).toBe(
      'Bearer jwt-token-typewoo'
    );
  });

  it('does NOT add Authorization for Admin API requests', async () => {
    const storage = memoryStorageProvider();
    await storage.set('jwt-token-should-not-apply');
    addTokenInterceptor(makeConfig({ auth: { accessToken: { storage } } }));

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/v3/products',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['Authorization']).toBeUndefined();
  });

  it('does not add header when no token in storage', async () => {
    const storage = memoryStorageProvider(); // empty
    addTokenInterceptor(makeConfig({ auth: { accessToken: { storage } } }));

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/store/v1/products',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['Authorization']).toBeUndefined();
  });

  it('does not add header when no accessToken storage configured', async () => {
    addTokenInterceptor(makeConfig());

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/store/v1/products',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['Authorization']).toBeUndefined();
  });
});

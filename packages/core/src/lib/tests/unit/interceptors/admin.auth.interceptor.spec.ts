import { describe, it, expect, vi, beforeEach } from 'vitest';
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

import { addAdminAuthInterceptor } from '../../../interceptors/admin-auth.interceptor.js';

type FakeConfig = { url?: string; headers: Record<string, unknown> };

function makeConfig(overrides?: Partial<ResolvedSdkConfig>): ResolvedSdkConfig {
  return {
    baseUrl: 'https://store.test',
    uniqueIdentifier: 'test',
    request: { retry: { enabled: false } },
    ...overrides,
  } as ResolvedSdkConfig;
}

describe('admin-auth.interceptor', () => {
  beforeEach(() => {
    reqUse.mockClear();
  });

  it('adds Basic Authorization for wc/v3 requests when credentials are set', async () => {
    addAdminAuthInterceptor(
      makeConfig({
        admin: {
          consumer_key: 'ck_abc',
          consumer_secret: 'cs_def',
          useAuthInterceptor: true,
        },
      })
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/v3/products',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);

    const expected = `Basic ${btoa('ck_abc:cs_def')}`;
    expect((result as FakeConfig).headers['Authorization']).toBe(expected);
  });

  it('adds Basic Authorization for wc-analytics requests', async () => {
    addAdminAuthInterceptor(
      makeConfig({
        admin: {
          consumer_key: 'ck_abc',
          consumer_secret: 'cs_def',
          useAuthInterceptor: true,
        },
      })
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc-analytics/reports/revenue/stats',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);

    const expected = `Basic ${btoa('ck_abc:cs_def')}`;
    expect((result as FakeConfig).headers['Authorization']).toBe(expected);
  });

  it('does NOT add Authorization for Store API requests', async () => {
    addAdminAuthInterceptor(
      makeConfig({
        admin: {
          consumer_key: 'ck_abc',
          consumer_secret: 'cs_def',
          useAuthInterceptor: true,
        },
      })
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/store/v1/cart',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);

    expect((result as FakeConfig).headers['Authorization']).toBeUndefined();
  });

  it('does NOT add Authorization when useAuthInterceptor is not set', async () => {
    addAdminAuthInterceptor(
      makeConfig({
        admin: { consumer_key: 'ck_abc', consumer_secret: 'cs_def' },
      })
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/v3/products',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);

    expect((result as FakeConfig).headers['Authorization']).toBeUndefined();
  });

  it('does NOT add Authorization when credentials are missing', async () => {
    addAdminAuthInterceptor(
      makeConfig({
        admin: { useAuthInterceptor: true },
      })
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      url: '/wp-json/wc/v3/products',
      headers: {},
    } as unknown as InternalAxiosRequestConfig);

    expect((result as FakeConfig).headers['Authorization']).toBeUndefined();
  });
});

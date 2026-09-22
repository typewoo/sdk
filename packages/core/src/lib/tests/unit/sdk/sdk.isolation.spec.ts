import { describe, it, expect, vi } from 'vitest';
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { createTypewoo } from '../../../sdk.js';
import { doGet } from '../../../http/http.js';
import {
  memoryStorageProvider,
  type StorageProvider,
} from '../../../storage/auth.storage.js';

const CART_URL = '/wp-json/wc/store/v1/cart';

/**
 * Axios adapter that records every outgoing request instead of hitting the
 * network, so the real interceptor chain of each instance runs.
 */
function recordingAdapter() {
  const requests: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config);
    return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
  };
  return { requests, adapter };
}

function makeInstance(baseUrl: string, token?: string) {
  const { requests, adapter } = recordingAdapter();
  const storage = memoryStorageProvider();
  if (token) void storage.set(token);
  const sdk = createTypewoo({
    baseUrl,
    suppressStorageWarnings: true,
    axiosConfig: { adapter },
    auth: { accessToken: { storage } },
  });
  return { sdk, requests };
}

describe('createTypewoo() instance isolation', () => {
  it('sends each instance to its own baseUrl', async () => {
    const a = makeInstance('https://store-a.test');
    const b = makeInstance('https://store-b.test');

    await a.sdk.http.get(CART_URL);
    await b.sdk.http.get(CART_URL);

    expect(a.requests).toHaveLength(1);
    expect(a.requests[0].baseURL).toBe('https://store-a.test');
    expect(b.requests).toHaveLength(1);
    expect(b.requests[0].baseURL).toBe('https://store-b.test');
  });

  it('never sends one instance’s access token on another’s request', async () => {
    const a = makeInstance('https://store.test', 'token-a');
    const b = makeInstance('https://store.test', 'token-b');

    await a.sdk.http.get(CART_URL);
    await b.sdk.http.get(CART_URL);

    expect(a.requests[0].headers['Authorization']).toBe('Bearer token-a');
    expect(b.requests[0].headers['Authorization']).toBe('Bearer token-b');
  });

  it('does not add interceptors to existing instances when new ones are created', async () => {
    const first = makeInstance('https://store.test', 'token-first');
    const countHandlers = () =>
      (
        first.sdk.http.client.interceptors.request as unknown as {
          handlers: unknown[];
        }
      ).handlers.length;
    const before = countHandlers();

    for (let i = 0; i < 20; i++) {
      makeInstance('https://store.test', `token-${i}`);
    }

    expect(countHandlers()).toBe(before);
    await first.sdk.http.get(CART_URL);
    expect(first.requests[0].headers['Authorization']).toBe(
      'Bearer token-first'
    );
  });

  it('runs request hooks only for the instance that made the request', async () => {
    const onRequestA = vi.fn();
    const onRequestB = vi.fn();
    const { adapter } = recordingAdapter();
    const a = createTypewoo({
      baseUrl: 'https://store-a.test',
      suppressStorageWarnings: true,
      axiosConfig: { adapter },
      request: { onRequest: onRequestA },
    });
    createTypewoo({
      baseUrl: 'https://store-b.test',
      suppressStorageWarnings: true,
      axiosConfig: { adapter },
      request: { onRequest: onRequestB },
    });

    await a.http.get(CART_URL);

    expect(onRequestA).toHaveBeenCalledTimes(1);
    expect(onRequestB).not.toHaveBeenCalled();
  });

  it('binds factory-style custom endpoints to their own instance', async () => {
    const a = recordingAdapter();
    const b = recordingAdapter();
    const make = (baseUrl: string, adapter: AxiosAdapter) =>
      createTypewoo({
        baseUrl,
        suppressStorageWarnings: true,
        axiosConfig: { adapter },
        endpoints: (http) => ({
          posts: () => http.get<unknown[]>('/wp-json/wp/v2/posts'),
        }),
      });

    await make('https://store-a.test', a.adapter).endpoints.posts();
    await make('https://store-b.test', b.adapter).endpoints.posts();

    expect(a.requests[0].baseURL).toBe('https://store-a.test');
    expect(b.requests[0].baseURL).toBe('https://store-b.test');
  });

  it('still accepts plain-object custom endpoints', () => {
    const posts = vi.fn();
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      suppressStorageWarnings: true,
      endpoints: { posts },
    });
    expect(sdk.endpoints.posts).toBe(posts);
  });

  it('routes the free doGet helper through the given context', async () => {
    const a = makeInstance('https://store-a.test');
    const b = makeInstance('https://store-b.test');

    await doGet(CART_URL, undefined, {
      client: b.sdk.http.client,
      config: b.sdk.config,
    });

    expect(a.requests).toHaveLength(0);
    expect(b.requests).toHaveLength(1);
  });
});

describe('TypewooClient.ready', () => {
  it('resolves after the stored auth state is loaded', async () => {
    const { sdk } = makeInstance('https://store.test', 'stored-token');
    const listener = vi.fn();
    sdk.events.on('auth:changed', listener);

    await sdk.ready;

    expect(sdk.state.authenticated).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('resolves unauthenticated when the storage provider rejects', async () => {
    const failing: StorageProvider = {
      get: () => Promise.reject(new Error('storage blocked')),
      set: () => Promise.resolve(),
      clear: () => Promise.resolve(),
    };
    const sdk = createTypewoo({
      baseUrl: 'https://store.test',
      suppressStorageWarnings: true,
      auth: { accessToken: { storage: failing } },
    });

    await expect(sdk.ready).resolves.toBeUndefined();
    expect(sdk.state.authenticated).toBe(false);
  });
});

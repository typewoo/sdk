import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventBus } from '../../../bus/event.bus.js';
import type { SdkEvent } from '../../../sdk.events.js';
import { memoryStorageProvider } from '../../../storage/auth.storage.js';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';
import type { InternalAxiosRequestConfig } from 'axios';

const { reqUse, resUse } = vi.hoisted(() => ({
  reqUse: vi.fn(),
  resUse: vi.fn(),
}));

vi.mock('../../../http/http.client.js', () => ({
  createHttpClient: vi.fn(),
  httpClient: {
    interceptors: {
      request: { use: reqUse },
      response: { use: resUse },
    },
  },
}));

import { addNonceInterceptors } from '../../../interceptors/nonce.interceptor.js';

type FakeConfig = { headers: Record<string, unknown> };

function makeConfig(overrides?: Partial<ResolvedSdkConfig>): ResolvedSdkConfig {
  return {
    baseUrl: 'https://store.test',
    uniqueIdentifier: 'test',
    request: { retry: { enabled: false } },
    ...overrides,
  } as ResolvedSdkConfig;
}

describe('nonce.interceptor', () => {
  beforeEach(() => {
    reqUse.mockClear();
    resUse.mockClear();
  });

  it('adds nonce header from state when nonce is present', async () => {
    const state = { nonce: 'abc123' };
    const events = new EventBus<SdkEvent>();
    addNonceInterceptors(makeConfig(), state, events);

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['nonce']).toBe('abc123');
  });

  it('skips nonce header when nonce is absent from state', async () => {
    const state = {};
    const events = new EventBus<SdkEvent>();
    addNonceInterceptors(makeConfig(), state, events);

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['nonce']).toBeUndefined();
  });

  it('skips nonce header when disabled=true', async () => {
    const state = { nonce: 'skip-me' };
    const events = new EventBus<SdkEvent>();
    addNonceInterceptors(
      makeConfig({
        nonce: { disabled: true, storage: memoryStorageProvider() },
      }),
      state,
      events
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['nonce']).toBeUndefined();
  });

  it('adds nonce from storage when storage is configured', async () => {
    const storage = memoryStorageProvider();
    await storage.set('stored-nonce');
    const state = {};
    const events = new EventBus<SdkEvent>();
    addNonceInterceptors(makeConfig({ nonce: { storage } }), state, events);

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['nonce']).toBe('stored-nonce');
  });

  it('updates state.nonce and emits event on response with nonce header', async () => {
    const state: Record<string, unknown> = {};
    const events = new EventBus<SdkEvent>();
    const listener = vi.fn();
    events.on('nonce:changed', listener);
    addNonceInterceptors(makeConfig(), state, events);

    const [resHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      (r: unknown) => Promise<unknown>
    ];
    await resHandler({ headers: { nonce: 'new-nonce' } });
    expect(state.nonce).toBe('new-nonce');
    expect(listener).toHaveBeenCalledWith('new-nonce');
  });

  it('does not update state when response has no nonce header', async () => {
    const state: Record<string, unknown> = { nonce: 'old' };
    const events = new EventBus<SdkEvent>();
    addNonceInterceptors(makeConfig(), state, events);

    const [resHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      (r: unknown) => Promise<unknown>
    ];
    await resHandler({ headers: {} });
    expect(state.nonce).toBe('old');
  });
});

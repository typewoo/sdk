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

import { addCartTokenInterceptors } from '../../../interceptors/cart.token.interceptor.js';

type FakeConfig = { headers: Record<string, unknown> };

function makeConfig(overrides?: Partial<ResolvedSdkConfig>): ResolvedSdkConfig {
  return {
    baseUrl: 'https://store.test',
    uniqueIdentifier: 'test',
    request: { retry: { enabled: false } },
    ...overrides,
  } as ResolvedSdkConfig;
}

describe('cart.token.interceptor', () => {
  beforeEach(() => {
    reqUse.mockClear();
    resUse.mockClear();
  });

  it('adds cart-token header from storage', async () => {
    const storage = memoryStorageProvider();
    await storage.set('tok-xyz');
    const state = {};
    const events = new EventBus<SdkEvent>();
    addCartTokenInterceptors(
      makeConfig({ cartToken: { storage } }),
      state,
      events
    );

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['cart-token']).toBe('tok-xyz');
  });

  it('adds cart-token from state when no storage', async () => {
    const state = { cartToken: 'state-tok' };
    const events = new EventBus<SdkEvent>();
    addCartTokenInterceptors(makeConfig(), state, events);

    const [reqHandler] = reqUse.mock.calls[reqUse.mock.calls.length - 1] as [
      (c: FakeConfig) => Promise<FakeConfig>
    ];
    const result = await reqHandler({
      headers: {},
    } as unknown as InternalAxiosRequestConfig);
    expect((result as FakeConfig).headers['cart-token']).toBe('state-tok');
  });

  it('skips cart-token when disabled=true', async () => {
    const state = { cartToken: 'skip-me' };
    const events = new EventBus<SdkEvent>();
    addCartTokenInterceptors(
      makeConfig({
        cartToken: { disabled: true, storage: memoryStorageProvider() },
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
    expect((result as FakeConfig).headers['cart-token']).toBeUndefined();
  });

  it('updates state.cartToken and emits event when response contains cart-token', async () => {
    const state: Record<string, unknown> = {};
    const events = new EventBus<SdkEvent>();
    const listener = vi.fn();
    events.on('cart:token:changed', listener);
    addCartTokenInterceptors(makeConfig(), state, events);

    const [resHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      (r: unknown) => Promise<unknown>
    ];
    await resHandler({ headers: { 'cart-token': 'new-cart-tok' } });
    expect(state.cartToken).toBe('new-cart-tok');
    expect(listener).toHaveBeenCalledWith('new-cart-tok');
  });

  it('does not emit event when response has no cart-token header', async () => {
    const state: Record<string, unknown> = {};
    const events = new EventBus<SdkEvent>();
    const listener = vi.fn();
    events.on('cart:token:changed', listener);
    addCartTokenInterceptors(makeConfig(), state, events);

    const [resHandler] = resUse.mock.calls[resUse.mock.calls.length - 1] as [
      (r: unknown) => Promise<unknown>
    ];
    await resHandler({ headers: {} });
    expect(listener).not.toHaveBeenCalled();
  });
});

import type { AxiosInstance } from 'axios';
import type { ResolvedSdkConfig } from '../../configs/sdk.config.js';
import type { SdkState } from '../../types/sdk.state.js';
import { EventBus } from '../../bus/event.bus.js';
import type { SdkEvent } from '../../sdk.events.js';
import type { RequestOptions } from '../../types/request.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
  doHead,
  type TypewooHttp,
} from '../../http/http.js';

const DEFAULT_CONFIG: ResolvedSdkConfig = {
  baseUrl: 'https://store.test',
  uniqueIdentifier: 'test-sdk',
  request: {
    retry: {
      enabled: false,
    },
  },
};

/**
 * HTTP helpers that forward to the free `doGet`/`doPost`/… functions without
 * a context, so spec files can keep mocking `http/http.js` and asserting on
 * those mocks directly.
 */
function makeTestHttp(): TypewooHttp {
  return {
    client: {} as AxiosInstance,
    get: <T>(url: string, options?: RequestOptions) => doGet<T>(url, options),
    post: <T, TData>(url: string, data?: TData, options?: RequestOptions) =>
      doPost<T, TData>(url, data, options),
    put: <T, TData>(url: string, data?: TData, options?: RequestOptions) =>
      doPut<T, TData>(url, data, options),
    delete: <T>(url: string, options?: RequestOptions) =>
      doDelete<T>(url, options),
    head: <T>(url: string, options?: RequestOptions) => doHead<T>(url, options),
  };
}

export function makeTestDeps(overrides?: Partial<ResolvedSdkConfig>) {
  const state: SdkState = {};
  const config: ResolvedSdkConfig = { ...DEFAULT_CONFIG, ...overrides };
  const events = new EventBus<SdkEvent>();
  const http = makeTestHttp();
  return { state, config, events, http };
}

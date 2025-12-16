import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ResolvedSdkConfig } from '../configs/sdk.config.js';
import { httpClient } from '../http/index.js';
import { SdkState } from '../types/sdk.state.js';
import { EventBus } from '../bus/event.bus.js';
import { SdkEvent } from '../sdk.events.js';

export const addNonceInterceptors = (
  config: ResolvedSdkConfig,
  state: SdkState,
  events: EventBus<SdkEvent>
) => {
  const nonceStorage = config.nonce?.storage;

  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (config.nonce?.disabled) return axiosConfig;

      const nonce = nonceStorage ? await nonceStorage.get() : state.nonce;

      if (!nonce) return axiosConfig;

      axiosConfig.headers['nonce'] = nonce;
      return axiosConfig;
    },
    (error: AxiosError | Error) => {
      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(async (response) => {
    if (config.nonce?.disabled) return response;

    const headers = response.headers;
    const nonce = headers['nonce'];
    if (!nonce) return response;

    state.nonce = nonce;
    if (nonceStorage) {
      await nonceStorage.set(nonce);
    }
    events.emit('nonce:changed', nonce);
    return response;
  });
};

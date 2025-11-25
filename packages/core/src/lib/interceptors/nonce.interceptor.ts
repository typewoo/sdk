import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SdkConfig } from '../configs/sdk.config.js';
import { httpClient } from '../../index.js';
import { SdkState } from '../types/sdk.state.js';
import { EventBus } from '../bus/event.bus.js';
import { SdkEvent } from '../sdk.events.js';

export const addNonceInterceptors = (
  config: SdkConfig,
  state: SdkState,
  events: EventBus<SdkEvent>
) => {
  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (config.nonce?.disabled) return axiosConfig;

      const nonce = config.nonce?.getToken
        ? await config.nonce?.getToken()
        : state.nonce;

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
    if (config.nonce?.setToken) {
      await config.nonce?.setToken(nonce);
    }
    events.emit('nonce:changed', nonce);
    return response;
  });
};

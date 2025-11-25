import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SdkConfig } from '../configs/sdk.config.js';
import { httpClient } from '../../index.js';
import { SdkState } from '../types/sdk.state.js';
import { EventBus } from '../bus/event.bus.js';
import { SdkEvent } from '../sdk.events.js';

export const addCartTokenInterceptors = (
  config: SdkConfig,
  state: SdkState,
  events: EventBus<SdkEvent>
) => {
  // Add interceptor for cart token
  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (config.cartToken?.disabled) return axiosConfig;

      const cartToken = config.cartToken?.getToken
        ? await config.cartToken?.getToken()
        : state.cartToken;

      if (!cartToken) return axiosConfig;

      axiosConfig.headers['cart-token'] = cartToken;
      return axiosConfig;
    },
    (error: AxiosError | Error) => {
      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(async (response) => {
    if (config.cartToken?.disabled) return response;

    const headers = response.headers;
    const cartToken = headers['cart-token'];
    if (!cartToken) return response;

    state.cartToken = cartToken;
    if (config.cartToken?.setToken) {
      await config.cartToken?.setToken(cartToken);
    }
    events.emit('cart:token:changed', cartToken);
    return response;
  });
};

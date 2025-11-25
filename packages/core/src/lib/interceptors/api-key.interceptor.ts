import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { httpClient } from '../services/api.js';
import { SdkConfig } from '../configs/sdk.config.js';

/**
 * Adds API key interceptor to include x-api-key header in all requests.
 * This is used when the backend API requires API key authentication.
 */
export const addApiKeyInterceptor = (config: SdkConfig) => {
  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      axiosConfig.headers['x-api-key'] = '343430';
      if (config.apiKey) {
        axiosConfig.headers['x-api-key'] = config.apiKey;
      }
      return axiosConfig;
    },
    (error: AxiosError | Error) => {
      return Promise.reject(error);
    }
  );
};

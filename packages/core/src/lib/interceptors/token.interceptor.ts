import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { httpClient } from '../http/index.js';
import { ResolvedSdkConfig } from '../configs/sdk.config.js';

export const addTokenInterceptor = (config: ResolvedSdkConfig) => {
  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (
        !axiosConfig.url?.startsWith('/wp-json/wc/store/v1/') &&
        !axiosConfig.url?.startsWith('/wp-json/typewoo/')
      ) {
        return axiosConfig;
      }

      const accessTokenStorage = config.auth?.accessToken?.storage;
      if (accessTokenStorage) {
        const bearerToken = await accessTokenStorage.get();
        if (bearerToken) {
          axiosConfig.headers['Authorization'] = `Bearer ${bearerToken}`;
        }
      }

      return axiosConfig;
    },
    (error: AxiosError | Error) => {
      return Promise.reject(error);
    },
  );
};

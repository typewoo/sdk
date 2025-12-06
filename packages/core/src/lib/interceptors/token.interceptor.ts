import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { httpClient } from '../services/api.js';
import { SdkConfig } from '../configs/sdk.config.js';
import { StorageProvider } from '../utilities/storage.providers.js';

export const addTokenInterceptor = (config: SdkConfig) => {
  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (
        !axiosConfig.url?.startsWith('/wp-json/wc/store/v1/') &&
        !axiosConfig.url?.startsWith('/wp-json/typewoo/')
      ) {
        return axiosConfig;
      }

      const accessTokenStorage = config.auth?.accessToken?.storage as
        | StorageProvider
        | undefined;
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
    }
  );
};

import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ResolvedSdkConfig } from '../configs/sdk.config.js';
import { httpClient } from '../http/index.js';

export const addAdminAuthInterceptor = (config: ResolvedSdkConfig) => {
  httpClient.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (!axiosConfig.url?.startsWith('/wp-json/wc/v3/')) return axiosConfig;
      if (config.admin?.useAuthInterceptor) {
        if (!config.admin.consumer_key || !config.admin.consumer_secret) {
          return axiosConfig;
        }

        const b64 = btoa(
          `${config.admin.consumer_key}:${config.admin.consumer_secret}`,
        );
        axiosConfig.headers['Authorization'] = `Basic ${b64}`;
      }

      return axiosConfig;
    },
    (error: AxiosError | Error) => {
      return Promise.reject(error);
    },
  );
};

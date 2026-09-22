import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ResolvedSdkConfig } from '../configs/sdk.config.js';

const ADMIN_AUTH_PREFIXES = ['/wp-json/wc/v3/', '/wp-json/wc-analytics/'];

export const addAdminAuthInterceptor = (
  client: AxiosInstance,
  config: ResolvedSdkConfig
) => {
  client.interceptors.request.use(
    async (axiosConfig: InternalAxiosRequestConfig) => {
      if (
        !ADMIN_AUTH_PREFIXES.some((prefix) =>
          axiosConfig.url?.startsWith(prefix)
        )
      ) {
        return axiosConfig;
      }

      if (config.admin?.useAuthInterceptor) {
        if (!config.admin.consumer_key || !config.admin.consumer_secret) {
          return axiosConfig;
        }

        const b64 = btoa(
          `${config.admin.consumer_key}:${config.admin.consumer_secret}`
        );
        axiosConfig.headers['Authorization'] = `Basic ${b64}`;
      }

      return axiosConfig;
    },
    (error: AxiosError | Error) => {
      return Promise.reject(error);
    }
  );
};

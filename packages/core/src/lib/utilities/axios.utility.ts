import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { httpClient } from '../services/api.js';
import { AxiosApiResult, ApiError } from '../types/api.js';

export const doGet = async <T>(url: string, options?: AxiosRequestConfig) => {
  return await doRequest<T>(httpClient, url, {
    ...options,
    method: 'get',
  });
};

export const doPost = async <T, TData>(
  url: string,
  data?: TData,
  options?: AxiosRequestConfig
) => {
  return await doRequest<T>(httpClient, url, {
    ...options,
    method: 'post',
    data: data,
  });
};

export const doPut = async <T, TData>(
  url: string,
  data?: TData,
  options?: AxiosRequestConfig
) => {
  return await doRequest<T>(httpClient, url, {
    ...options,
    method: 'put',
    data: data,
  });
};

export const doDelete = async <T>(
  url: string,
  options?: AxiosRequestConfig
) => {
  return await doRequest<T>(httpClient, url, {
    ...options,
    method: 'delete',
  });
};

export const doHead = async <T>(url: string, options?: AxiosRequestConfig) => {
  return await doRequest<T>(httpClient, url, {
    ...options,
    method: 'head',
    validateStatus: () => true,
  });
};

export const doRequest = async <T>(
  instance: AxiosInstance,
  url: string,
  options: AxiosRequestConfig
): Promise<AxiosApiResult<T>> => {
  const { method = 'get', data, params, headers } = options;
  try {
    const response = await instance.request<T>({
      ...options,
      url,
      method,
      data,
      params,
      headers,
    });

    return {
      data: response.data,
      headers: response.headers
        ? Object.fromEntries(
            Object.entries(response.headers).map(([key, value]) => [
              key.toLowerCase(),
              value,
            ])
          )
        : undefined,
      status: response.status,
    } as AxiosApiResult<T>;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    // Server returned an error response (4xx, 5xx)
    if (axiosError.response) {
      return {
        error: axiosError.response.data ?? {
          code: `http_${axiosError.response.status}`,
          message: axiosError.message || 'Request failed',
          data: { status: axiosError.response.status },
          details: {},
        },
        headers: Object.fromEntries(
          Object.entries(axiosError.response.headers).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ])
        ),
        status: axiosError.response.status,
      } as AxiosApiResult<T>;
    }

    // Network error (server down, timeout, DNS failure, etc.)
    if (axiosError.request) {
      return {
        error: {
          code: axiosError.code || 'network_error',
          message:
            axiosError.message || 'Network error: Unable to reach the server',
          data: {
            status: 0,
          },
          details: {},
        },
        status: 0,
      } as AxiosApiResult<T>;
    }

    // Request setup error (e.g., invalid config)
    return {
      error: {
        code: 'request_error',
        message: axiosError.message || 'Failed to setup request',
        data: { status: 0 },
        details: {},
      },
      status: 0,
    } as AxiosApiResult<T>;
  }
};

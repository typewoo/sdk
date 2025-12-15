import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { httpClient } from '../services/api.js';
import { AxiosApiResult, ApiError } from '../types/api.js';
import { RequestContext, RequestOptions } from '../types/request.js';

export const doGet = async <T>(
  url: string,
  requestOptions?: RequestOptions
) => {
  return await doRequest<T>(httpClient, url, {
    ...requestOptions,
    axiosConfig: {
      ...requestOptions?.axiosConfig,
      method: 'get',
    },
  });
};

export const doPost = async <T, TData>(
  url: string,
  data?: TData,
  requestOptions?: RequestOptions
) => {
  return await doRequest<T>(httpClient, url, {
    ...requestOptions,
    axiosConfig: {
      ...requestOptions?.axiosConfig,
      method: 'post',
      data: data,
    },
  });
};

export const doPut = async <T, TData>(
  url: string,
  data?: TData,
  requestOptions?: RequestOptions
) => {
  return await doRequest<T>(httpClient, url, {
    ...requestOptions,
    axiosConfig: {
      ...requestOptions?.axiosConfig,
      method: 'put',
      data: data,
    },
  });
};

export const doDelete = async <T>(
  url: string,
  requestOptions?: RequestOptions
) => {
  return await doRequest<T>(httpClient, url, {
    ...requestOptions,
    axiosConfig: {
      ...requestOptions?.axiosConfig,
      method: 'delete',
    },
  });
};

export const doHead = async <T>(
  url: string,
  requestOptions?: RequestOptions
) => {
  return await doRequest<T>(httpClient, url, {
    ...requestOptions,
    axiosConfig: {
      ...requestOptions?.axiosConfig,
      method: 'head',
      validateStatus: () => true,
    },
  });
};

export const doRequest = async <T>(
  instance: AxiosInstance,
  url: string,
  requestOptions: RequestOptions
): Promise<AxiosApiResult<T>> => {
  const options = requestOptions.axiosConfig;
  const { method = 'get', data, params, headers } = options ?? {};

  const context: RequestContext<T> = {
    url: `${instance.defaults.baseURL}${url}`,
    path: url,
    config: { ...(instance.defaults as AxiosRequestConfig), ...options },
    method: method,
    payload: data,
  };

  let responseData: T | undefined;
  let responseError: ApiError | undefined;

  try {
    requestOptions?.onLoading?.(true);
    requestOptions?.onRequest?.(context);
    const response = await instance.request<T>({
      ...options,
      url,
      method,
      data,
      params,
      headers,
    });

    responseData = response.data;
    requestOptions?.onResponse?.(responseData, context);

    return {
      data: responseData,
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
      const result = {
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

      responseError = result.error as ApiError;
      requestOptions?.onError?.(responseError, context);
      return result;
    }

    // Network error (server down, timeout, DNS failure, etc.)
    if (axiosError.request) {
      const result = {
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

      responseError = result.error as ApiError;
      requestOptions?.onError?.(responseError, context);
      return result;
    }

    // Request setup error (e.g., invalid config)
    const result = {
      error: {
        code: 'request_error',
        message: axiosError.message || 'Failed to setup request',
        data: { status: 0 },
        details: {},
      },
      status: 0,
    } as AxiosApiResult<T>;

    responseError = result.error as ApiError;
    requestOptions?.onError?.(responseError, context);
    return result;
  } finally {
    requestOptions?.onFinally?.(responseData, responseError, context);
    requestOptions?.onLoading?.(false);
  }
};

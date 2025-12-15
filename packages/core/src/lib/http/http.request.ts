import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import { getSdkConfig } from '../configs';
import { AxiosApiResult, ApiError } from '../types';
import { RequestContext, RequestOptions } from '../types/request';
import { createRequest } from './http';
import { getRetryDelay, shouldRetry, sleep } from './http.helper';

export const doRequest = async <T>(
  instance: AxiosInstance,
  url: string,
  requestOptions: RequestOptions
): Promise<AxiosApiResult<T>> => {
  const options = requestOptions.axiosConfig;
  const { method = 'get', data } = options ?? {};

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

    const { response, error } = await doRequestWithRetry<T>(
      instance,
      url,
      requestOptions,
      context
    );

    if (error) {
      throw error;
    }

    responseData = response?.data;
    requestOptions?.onResponse?.(responseData, context);

    return {
      data: responseData,
      headers: response?.headers
        ? Object.fromEntries(
            Object.entries(response.headers).map(([key, value]) => [
              key.toLowerCase(),
              value,
            ])
          )
        : undefined,
      status: response?.status,
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
/**
 * Execute request with retry logic
 */
const doRequestWithRetry = async <T>(
  instance: AxiosInstance,
  url: string,
  requestOptions: RequestOptions,
  context: RequestContext<T>
): Promise<{
  response?: AxiosResponse<T>;
  error?: AxiosError;
}> => {
  const config = getSdkConfig();
  const retryConfig = config?.request?.retry;
  const method = requestOptions.axiosConfig?.method ?? 'get';

  // If retry is not enabled or not configured, just make a single request
  if (!retryConfig?.enabled) {
    try {
      const response = await createRequest<T>(instance, url, requestOptions);
      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  }

  const maxRetries =
    typeof retryConfig.maxRetries === 'number'
      ? retryConfig.maxRetries
      : typeof retryConfig.maxRetries === 'function'
      ? retryConfig.maxRetries()
      : 3;

  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await createRequest<T>(instance, url, requestOptions);
      return { response };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!shouldRetry(axiosError, attempt, method)) {
        return { error: axiosError };
      }

      // Call onRetry callback
      if (retryConfig?.onRetry) {
        retryConfig.onRetry(attempt + 1, axiosError, context.config);
      }

      // Wait before retrying
      const delay = getRetryDelay(retryConfig?.delay, attempt);
      await sleep(delay);

      attempt++;
    }
  }
};

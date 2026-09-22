import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import type { ResolvedSdkConfig } from '../configs/sdk.config.js';
import { AxiosApiResult, ApiError } from '../types/index.js';
import { RequestContext, RequestOptions } from '../types/request.js';
import { createRequest } from './http.js';
import {
  createError,
  getRetryDelay,
  shouldRetry,
  sleep,
} from './http.helper.js';

export const doRequest = async <T>(
  instance: AxiosInstance,
  url: string,
  requestOptions: RequestOptions,
  sdkConfig?: ResolvedSdkConfig
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
    await requestOptions?.onLoading?.(true, context);
    await sdkConfig?.request?.onLoading?.(true, context);

    await requestOptions?.onRequest?.(context);
    await sdkConfig?.request?.onRequest?.(context);

    const { response, error } = await doRequestWithRetry<T>(
      instance,
      url,
      requestOptions,
      context,
      sdkConfig
    );

    if (error) {
      throw error;
    }

    responseData = response?.data;
    await requestOptions?.onResponse?.(responseData, context);
    await sdkConfig?.request?.onResponse?.(responseData, context);

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
    const errorResult = createError<T>(axiosError);
    responseError = errorResult.error;
    await requestOptions?.onError?.(responseError, context);
    await sdkConfig?.request?.onError?.(responseError, context);

    return errorResult;
  } finally {
    await requestOptions?.onFinally?.(responseData, responseError, context);
    await sdkConfig?.request?.onFinally?.(responseData, responseError, context);
    await requestOptions?.onLoading?.(false, context);
    await sdkConfig?.request?.onLoading?.(false, context);
  }
};
/**
 * Execute request with retry logic
 */
const doRequestWithRetry = async <T>(
  instance: AxiosInstance,
  url: string,
  requestOptions: RequestOptions,
  context: RequestContext<T>,
  config?: ResolvedSdkConfig
): Promise<{
  response?: AxiosResponse<T>;
  error?: AxiosError;
}> => {
  const retryConfig = config?.request?.retry;
  const method = requestOptions.axiosConfig?.method ?? 'get';

  // If retry is not enabled or not configured, just make a single request
  if (!retryConfig?.enabled) {
    try {
      const response = await createRequest<T>(instance, url, requestOptions);
      return { response };
    } catch (error) {
      return { error: error as AxiosError<ApiError> };
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
      const axiosError = error as AxiosError<ApiError>;

      if (!shouldRetry(axiosError, attempt, method, retryConfig)) {
        return { error: axiosError };
      }

      const errorResult = createError<T>(axiosError);
      await requestOptions?.onRetry?.(attempt + 1, errorResult.error, context);
      await config?.request?.onRetry?.(attempt + 1, errorResult.error, context);

      // Wait before retrying
      const delay = getRetryDelay(retryConfig?.delay, attempt);
      await sleep(delay);

      attempt++;
    }
  }

  // Should never reach here, but satisfy TypeScript
  return { error: new AxiosError('Max retries exceeded') };
};

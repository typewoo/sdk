import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import { getSdkConfig } from '../configs/index.js';
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
  const globalConfig = getSdkConfig();

  try {
    await requestOptions?.onLoading?.(true, context);
    await globalConfig?.request?.onLoading?.(true, context);

    await requestOptions?.onRequest?.(context);
    await globalConfig?.request?.onRequest?.(context);

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
    await requestOptions?.onResponse?.(responseData, context);
    await globalConfig?.request?.onResponse?.(responseData, context);

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
    await globalConfig?.request?.onError?.(responseError, context);

    return errorResult;
  } finally {
    await requestOptions?.onFinally?.(responseData, responseError, context);
    await globalConfig?.request?.onFinally?.(
      responseData,
      responseError,
      context
    );
    await requestOptions?.onLoading?.(false, context);
    await globalConfig?.request?.onLoading?.(false, context);
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

      if (!shouldRetry(axiosError, attempt, method)) {
        return { error: axiosError };
      }

      const errorResult = createError<T>(axiosError);
      await requestOptions?.onRetry?.(attempt + 1, errorResult.error, context);
      const globalCfg = getSdkConfig();
      await globalCfg?.request?.onRetry?.(
        attempt + 1,
        errorResult.error,
        context
      );

      // Wait before retrying
      const delay = getRetryDelay(retryConfig?.delay, attempt);
      await sleep(delay);

      attempt++;
    }
  }

  // Should never reach here, but satisfy TypeScript
  return { error: new AxiosError('Max retries exceeded') };
};

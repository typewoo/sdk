import { AxiosInstance } from 'axios';
import { RequestOptions } from '../types/request.js';
import { AxiosApiResult } from '../types/api.js';
import { doRequest } from './http.request.js';
import { HttpContext, resolveHttpContext } from './http.client.js';

/**
 * The free helpers below accept an optional `context` identifying which
 * Typewoo instance to send the request through. Without it they use the
 * first instance created; pass `http` from the `endpoints` factory (or use
 * `typewoo.http`) when working with multiple instances.
 */

export const doGet = async <T>(
  url: string,
  requestOptions?: RequestOptions,
  context?: HttpContext
) => {
  const { client, config } = resolveHttpContext(context);
  return await doRequest<T>(
    client,
    url,
    {
      ...requestOptions,
      axiosConfig: {
        ...requestOptions?.axiosConfig,
        method: 'get',
      },
    },
    config
  );
};

export const doPost = async <T, TData>(
  url: string,
  data?: TData,
  requestOptions?: RequestOptions,
  context?: HttpContext
) => {
  const { client, config } = resolveHttpContext(context);
  return await doRequest<T>(
    client,
    url,
    {
      ...requestOptions,
      axiosConfig: {
        ...requestOptions?.axiosConfig,
        method: 'post',
        data: data,
      },
    },
    config
  );
};

export const doPut = async <T, TData>(
  url: string,
  data?: TData,
  requestOptions?: RequestOptions,
  context?: HttpContext
) => {
  const { client, config } = resolveHttpContext(context);
  return await doRequest<T>(
    client,
    url,
    {
      ...requestOptions,
      axiosConfig: {
        ...requestOptions?.axiosConfig,
        method: 'put',
        data: data,
      },
    },
    config
  );
};

export const doDelete = async <T>(
  url: string,
  requestOptions?: RequestOptions,
  context?: HttpContext
) => {
  const { client, config } = resolveHttpContext(context);
  return await doRequest<T>(
    client,
    url,
    {
      ...requestOptions,
      axiosConfig: {
        ...requestOptions?.axiosConfig,
        method: 'delete',
      },
    },
    config
  );
};

export const doHead = async <T>(
  url: string,
  requestOptions?: RequestOptions,
  context?: HttpContext
) => {
  const { client, config } = resolveHttpContext(context);
  return await doRequest<T>(
    client,
    url,
    {
      ...requestOptions,
      axiosConfig: {
        ...requestOptions?.axiosConfig,
        method: 'head',
        validateStatus: () => true,
      },
    },
    config
  );
};

/**
 * HTTP helpers bound to one Typewoo instance.
 */
export interface TypewooHttp {
  /** The instance's axios client, e.g. for adding your own interceptors. */
  readonly client: AxiosInstance;
  get<T>(
    url: string,
    requestOptions?: RequestOptions
  ): Promise<AxiosApiResult<T>>;
  post<T, TData = unknown>(
    url: string,
    data?: TData,
    requestOptions?: RequestOptions
  ): Promise<AxiosApiResult<T>>;
  put<T, TData = unknown>(
    url: string,
    data?: TData,
    requestOptions?: RequestOptions
  ): Promise<AxiosApiResult<T>>;
  delete<T>(
    url: string,
    requestOptions?: RequestOptions
  ): Promise<AxiosApiResult<T>>;
  head<T>(
    url: string,
    requestOptions?: RequestOptions
  ): Promise<AxiosApiResult<T>>;
}

export const createHttp = (context: HttpContext): TypewooHttp => ({
  client: context.client,
  get: <T>(url: string, requestOptions?: RequestOptions) =>
    doGet<T>(url, requestOptions, context),
  post: <T, TData>(
    url: string,
    data?: TData,
    requestOptions?: RequestOptions
  ) => doPost<T, TData>(url, data, requestOptions, context),
  put: <T, TData>(url: string, data?: TData, requestOptions?: RequestOptions) =>
    doPut<T, TData>(url, data, requestOptions, context),
  delete: <T>(url: string, requestOptions?: RequestOptions) =>
    doDelete<T>(url, requestOptions, context),
  head: <T>(url: string, requestOptions?: RequestOptions) =>
    doHead<T>(url, requestOptions, context),
});

export const createRequest = <T>(
  instance: AxiosInstance,
  url: string,
  requestOptions: RequestOptions
) => {
  const options = requestOptions.axiosConfig;
  const { method = 'get', data, params, headers } = options ?? {};

  return instance.request<T>({
    ...options,
    url,
    method,
    data,
    params,
    headers,
  });
};

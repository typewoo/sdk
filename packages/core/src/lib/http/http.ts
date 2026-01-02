import { AxiosInstance } from 'axios';
import { RequestOptions } from '../types/request.js';
import { doRequest } from './http.request.js';
import { httpClient } from './http.client.js';

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

import { AxiosRequestConfig, Method } from 'axios';
import { ApiError } from './api';

export interface RequestContext<T = unknown> {
  url?: string;
  path?: string;
  config?: AxiosRequestConfig;
  method?: Method | string;
  payload?: T;
}
export interface RequestOptions<T = unknown> {
  axiosConfig?: AxiosRequestConfig;
  onRetry?: (
    attempt: number,
    error: ApiError | undefined,
    context: RequestContext<T>
  ) => void | Promise<void>;
  onError?: (
    error: ApiError | undefined,
    context: RequestContext<T>
  ) => void | Promise<void>;
  onRequest?: (context: RequestContext<T>) => void | Promise<void>;
  onResponse?: (
    response: T,
    context: RequestContext<T>
  ) => void | Promise<void>;
  onFinally?: (
    response: T | undefined,
    error: ApiError | undefined,
    context: RequestContext<T>
  ) => void | Promise<void>;
  onLoading?: (isLoading: boolean) => void | Promise<void>;
}

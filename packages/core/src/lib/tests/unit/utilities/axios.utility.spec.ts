import { describe, it, expect, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import {
  createError,
  createServerError,
  createNetworkError,
  createRequestError,
} from '../../../http/http.helper.js';
import type { AxiosError } from 'axios';
import type { ApiError } from '../../../types/api.js';
import { doRequest } from '../../../http/http.request.js';

describe('createServerError()', () => {
  it('returns error from response data', () => {
    const axiosError = {
      response: {
        data: {
          code: 'woocommerce_rest_not_found',
          message: 'Not found',
          data: { status: 404 },
          details: {},
        },
        headers: { 'x-test': 'yes' },
        status: 404,
      },
    } as AxiosError<ApiError>;

    const result = createServerError(axiosError);
    expect(result.error?.code).toBe('woocommerce_rest_not_found');
    expect(result.error?.message).toBe('Not found');
    expect(result.status).toBe(404);
  });

  it('normalises response headers to lowercase keys', () => {
    const axiosError = {
      response: {
        data: {
          code: 'err',
          message: 'msg',
          data: { status: 500 },
          details: {},
        },
        headers: { 'X-Custom-Header': 'value' },
        status: 500,
      },
    } as AxiosError<ApiError>;

    const result = createServerError(axiosError);
    expect(result.headers?.['x-custom-header']).toBe('value');
  });
});

describe('createNetworkError()', () => {
  it('returns a network_error code when no response', () => {
    const axiosError = {
      code: 'ECONNREFUSED',
      message: 'Connection refused',
      request: {},
    } as AxiosError<ApiError>;

    const result = createNetworkError(axiosError);
    expect(result.error?.code).toBe('ECONNREFUSED');
    expect(result.status).toBe(0);
  });
});

describe('createRequestError()', () => {
  it('returns request_error code for setup failures', () => {
    const axiosError = {
      message: 'Invalid URL',
    } as AxiosError<ApiError>;

    const result = createRequestError(axiosError);
    expect(result.error?.code).toBe('request_error');
    expect(result.error?.message).toBe('Invalid URL');
  });
});

describe('createError() dispatcher', () => {
  it('routes to createServerError when response is present', () => {
    const axiosError = {
      response: {
        data: {
          code: 'err',
          message: 'msg',
          data: { status: 400 },
          details: {},
        },
        headers: {},
        status: 400,
      },
    } as AxiosError<ApiError>;

    const result = createError(axiosError);
    expect(result.status).toBe(400);
  });

  it('routes to createNetworkError when only request is present', () => {
    const axiosError = {
      code: 'ENETDOWN',
      message: 'Network is down',
      request: {},
    } as AxiosError<ApiError>;

    const result = createError(axiosError);
    expect(result.error?.code).toBe('ENETDOWN');
  });

  it('routes to createRequestError when neither response nor request', () => {
    const axiosError = { message: 'Bad config' } as AxiosError<ApiError>;
    const result = createError(axiosError);
    expect(result.error?.code).toBe('request_error');
  });
});

describe('doRequest() error handling', () => {
  it('returns error structure when axios throws with a response', async () => {
    const instance = {
      defaults: { baseURL: 'http://test.local', headers: {} },
      request: vi.fn().mockRejectedValue({
        response: {
          data: {
            code: 'http_500',
            message: 'Server error',
            data: { status: 500 },
            details: {},
          },
          headers: { 'content-type': 'application/json' },
          status: 500,
        },
      }),
    } as unknown as AxiosInstance;

    const result = await doRequest<{ ok: boolean }>(instance, '/test', {
      axiosConfig: { method: 'get' },
    });
    expect(result.error?.code).toBe('http_500');
    expect(result.status).toBe(500);
  });
});

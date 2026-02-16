import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosInstance } from 'axios';
import { doRequest } from '../../../http/index.js';
import { setSdkConfig } from '../../../configs/sdk.config.js';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';

/**
 * Creates a mock AxiosInstance that resolves with given data.
 */
const createSuccessInstance = (responseData: unknown = { ok: true }) =>
  ({
    defaults: { baseURL: 'http://test.local', headers: {} },
    request: vi.fn().mockResolvedValue({
      data: responseData,
      headers: { 'content-type': 'application/json' },
      status: 200,
    }),
  } as unknown as AxiosInstance);

/**
 * Creates a mock AxiosInstance that rejects with given error data.
 */
const createErrorInstance = (
  errorData: { message: string; code?: string } = { message: 'fail' }
) =>
  ({
    defaults: { baseURL: 'http://test.local', headers: {} },
    request: vi.fn().mockRejectedValue({
      response: {
        data: errorData,
        headers: { 'x-err': '1' },
        status: 500,
      },
    }),
  } as unknown as AxiosInstance);

/**
 * Builds a minimal ResolvedSdkConfig with the given global request callbacks.
 */
const buildConfig = (
  requestOverrides: Partial<ResolvedSdkConfig['request']> = {}
): ResolvedSdkConfig => ({
  baseUrl: 'http://test.local',
  uniqueIdentifier: 'test-id',
  request: {
    retry: { enabled: false },
    ...requestOverrides,
  },
});

describe('Global request callbacks', () => {
  afterEach(() => {
    setSdkConfig(buildConfig());
  });

  describe('onRequest (global)', () => {
    it('should be called before the request is made', async () => {
      const onRequest = vi.fn();
      setSdkConfig(buildConfig({ onRequest }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
      });

      expect(onRequest).toHaveBeenCalledOnce();
      expect(onRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://test.local/test',
          path: '/test',
          method: 'get',
        })
      );
    });

    it('should be called after per-request onRequest', async () => {
      const callOrder: string[] = [];
      const perRequestOnRequest = vi.fn(() => callOrder.push('per-request'));
      const globalOnRequest = vi.fn(() => callOrder.push('global'));
      setSdkConfig(buildConfig({ onRequest: globalOnRequest }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
        onRequest: perRequestOnRequest,
      });

      expect(callOrder).toEqual(['per-request', 'global']);
    });
  });

  describe('onResponse (global)', () => {
    it('should be called with response data on success', async () => {
      const onResponse = vi.fn();
      setSdkConfig(buildConfig({ onResponse }));

      await doRequest(createSuccessInstance({ items: [1, 2] }), '/products', {
        axiosConfig: { method: 'get' },
      });

      expect(onResponse).toHaveBeenCalledOnce();
      expect(onResponse).toHaveBeenCalledWith(
        { items: [1, 2] },
        expect.objectContaining({ path: '/products' })
      );
    });

    it('should not be called on error', async () => {
      const onResponse = vi.fn();
      setSdkConfig(buildConfig({ onResponse }));

      await doRequest(createErrorInstance(), '/fail', {
        axiosConfig: { method: 'get' },
      });

      expect(onResponse).not.toHaveBeenCalled();
    });

    it('should be called after per-request onResponse', async () => {
      const callOrder: string[] = [];
      const perRequestOnResponse = vi.fn(() => callOrder.push('per-request'));
      const globalOnResponse = vi.fn(() => callOrder.push('global'));
      setSdkConfig(buildConfig({ onResponse: globalOnResponse }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
        onResponse: perRequestOnResponse,
      });

      expect(callOrder).toEqual(['per-request', 'global']);
    });
  });

  describe('onError (global)', () => {
    it('should be called with error details on failure', async () => {
      const onError = vi.fn();
      setSdkConfig(buildConfig({ onError }));

      await doRequest(
        createErrorInstance({ message: 'not found' }),
        '/missing',
        {
          axiosConfig: { method: 'get' },
        }
      );

      expect(onError).toHaveBeenCalledOnce();
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'not found' }),
        expect.objectContaining({ path: '/missing' })
      );
    });

    it('should not be called on success', async () => {
      const onError = vi.fn();
      setSdkConfig(buildConfig({ onError }));

      await doRequest(createSuccessInstance(), '/ok', {
        axiosConfig: { method: 'get' },
      });

      expect(onError).not.toHaveBeenCalled();
    });

    it('should be called after per-request onError', async () => {
      const callOrder: string[] = [];
      const perRequestOnError = vi.fn(() => callOrder.push('per-request'));
      const globalOnError = vi.fn(() => callOrder.push('global'));
      setSdkConfig(buildConfig({ onError: globalOnError }));

      await doRequest(createErrorInstance(), '/fail', {
        axiosConfig: { method: 'get' },
        onError: perRequestOnError,
      });

      expect(callOrder).toEqual(['per-request', 'global']);
    });
  });

  describe('onFinally (global)', () => {
    it('should be called after a successful request', async () => {
      const onFinally = vi.fn();
      setSdkConfig(buildConfig({ onFinally }));

      await doRequest(createSuccessInstance({ done: true }), '/ok', {
        axiosConfig: { method: 'get' },
      });

      expect(onFinally).toHaveBeenCalledOnce();
      expect(onFinally).toHaveBeenCalledWith(
        { done: true },
        undefined,
        expect.objectContaining({ path: '/ok' })
      );
    });

    it('should be called after a failed request', async () => {
      const onFinally = vi.fn();
      setSdkConfig(buildConfig({ onFinally }));

      await doRequest(createErrorInstance({ message: 'boom' }), '/fail', {
        axiosConfig: { method: 'get' },
      });

      expect(onFinally).toHaveBeenCalledOnce();
      expect(onFinally).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ message: 'boom' }),
        expect.objectContaining({ path: '/fail' })
      );
    });

    it('should be called after per-request onFinally', async () => {
      const callOrder: string[] = [];
      const perRequestOnFinally = vi.fn(() => callOrder.push('per-request'));
      const globalOnFinally = vi.fn(() => callOrder.push('global'));
      setSdkConfig(buildConfig({ onFinally: globalOnFinally }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
        onFinally: perRequestOnFinally,
      });

      expect(callOrder).toEqual(['per-request', 'global']);
    });
  });

  describe('onLoading (global)', () => {
    it('should be called with true then false on success', async () => {
      const onLoading = vi.fn();
      setSdkConfig(buildConfig({ onLoading }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
      });

      expect(onLoading).toHaveBeenCalledTimes(2);
      expect(onLoading.mock.calls[0][0]).toBe(true);
      expect(onLoading.mock.calls[1][0]).toBe(false);
    });

    it('should be called with true then false on error', async () => {
      const onLoading = vi.fn();
      setSdkConfig(buildConfig({ onLoading }));

      await doRequest(createErrorInstance(), '/fail', {
        axiosConfig: { method: 'get' },
      });

      expect(onLoading).toHaveBeenCalledTimes(2);
      expect(onLoading.mock.calls[0][0]).toBe(true);
      expect(onLoading.mock.calls[1][0]).toBe(false);
    });

    it('should receive context as second argument', async () => {
      const onLoading = vi.fn();
      setSdkConfig(buildConfig({ onLoading }));

      await doRequest(createSuccessInstance(), '/ctx-test', {
        axiosConfig: { method: 'post' },
      });

      expect(onLoading).toHaveBeenCalledTimes(2);
      // true call
      expect(onLoading.mock.calls[0][1]).toEqual(
        expect.objectContaining({
          path: '/ctx-test',
          method: 'post',
        })
      );
      // false call
      expect(onLoading.mock.calls[1][1]).toEqual(
        expect.objectContaining({
          path: '/ctx-test',
          method: 'post',
        })
      );
    });

    it('should be called after per-request onLoading', async () => {
      const callOrder: string[] = [];
      const perRequestOnLoading = vi.fn(() => callOrder.push('per-request'));
      const globalOnLoading = vi.fn(() => callOrder.push('global'));
      setSdkConfig(buildConfig({ onLoading: globalOnLoading }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
        onLoading: perRequestOnLoading,
      });

      // true: per-request, global, then false: per-request, global
      expect(callOrder).toEqual([
        'per-request',
        'global',
        'per-request',
        'global',
      ]);
    });

    it('should work without context (backward compatible)', async () => {
      // Simulate a consumer that only cares about the boolean
      const onLoading = vi.fn((_isLoading: boolean) => {
        /* no context usage */
      });
      setSdkConfig(buildConfig({ onLoading }));

      await doRequest(createSuccessInstance(), '/test', {
        axiosConfig: { method: 'get' },
      });

      expect(onLoading).toHaveBeenCalledTimes(2);
      expect(onLoading.mock.calls[0][0]).toBe(true);
      expect(onLoading.mock.calls[1][0]).toBe(false);
    });
  });

  describe('per-request onLoading context', () => {
    it('should receive context as second argument', async () => {
      const onLoading = vi.fn();

      await doRequest(createSuccessInstance(), '/per-req', {
        axiosConfig: { method: 'put' },
        onLoading,
      });

      expect(onLoading).toHaveBeenCalledTimes(2);
      expect(onLoading.mock.calls[0][1]).toEqual(
        expect.objectContaining({
          path: '/per-req',
          method: 'put',
        })
      );
      expect(onLoading.mock.calls[1][1]).toEqual(
        expect.objectContaining({
          path: '/per-req',
          method: 'put',
        })
      );
    });
  });

  describe('all callbacks together', () => {
    it('should invoke all global callbacks in correct order on success', async () => {
      const callOrder: string[] = [];
      const config = buildConfig({
        onLoading: vi.fn((isLoading) => callOrder.push(`loading:${isLoading}`)),
        onRequest: vi.fn(() => callOrder.push('request')),
        onResponse: vi.fn(() => callOrder.push('response')),
        onFinally: vi.fn(() => callOrder.push('finally')),
        onError: vi.fn(() => callOrder.push('error')),
      });
      setSdkConfig(config);

      await doRequest(createSuccessInstance(), '/all', {
        axiosConfig: { method: 'get' },
      });

      expect(callOrder).toEqual([
        'loading:true',
        'request',
        'response',
        'finally',
        'loading:false',
      ]);
    });

    it('should invoke all global callbacks in correct order on error', async () => {
      const callOrder: string[] = [];
      const config = buildConfig({
        onLoading: vi.fn((isLoading) => callOrder.push(`loading:${isLoading}`)),
        onRequest: vi.fn(() => callOrder.push('request')),
        onResponse: vi.fn(() => callOrder.push('response')),
        onError: vi.fn(() => callOrder.push('error')),
        onFinally: vi.fn(() => callOrder.push('finally')),
      });
      setSdkConfig(config);

      await doRequest(createErrorInstance(), '/all-err', {
        axiosConfig: { method: 'get' },
      });

      expect(callOrder).toEqual([
        'loading:true',
        'request',
        'error',
        'finally',
        'loading:false',
      ]);
    });
  });

  describe('no global config set', () => {
    beforeEach(() => {
      setSdkConfig(null as unknown as ResolvedSdkConfig);
    });

    it('should not throw when global config is null', async () => {
      const result = await doRequest(createSuccessInstance({ v: 1 }), '/safe', {
        axiosConfig: { method: 'get' },
      });

      expect(result.data).toEqual({ v: 1 });
      expect(result.error).toBeUndefined();
    });

    it('should still invoke per-request callbacks when no global config', async () => {
      const onRequest = vi.fn();
      const onResponse = vi.fn();

      await doRequest(createSuccessInstance(), '/local-only', {
        axiosConfig: { method: 'get' },
        onRequest,
        onResponse,
      });

      expect(onRequest).toHaveBeenCalledOnce();
      expect(onResponse).toHaveBeenCalledOnce();
    });
  });
});

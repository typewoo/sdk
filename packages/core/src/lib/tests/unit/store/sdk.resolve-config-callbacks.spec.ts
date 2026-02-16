import { describe, it, expect, vi } from 'vitest';
import { resolveConfig } from '../../../configs/sdk.config.js';
import type { SdkConfig } from '../../../configs/sdk.config.js';

describe('resolveConfig() – global request callbacks', () => {
  const baseConfig: SdkConfig = {
    baseUrl: 'https://example.com',
  };

  it('should set retry defaults when no request config is provided', () => {
    const resolved = resolveConfig(baseConfig);

    expect(resolved.request.retry.enabled).toBe(false);
    expect(resolved.request.onRetry).toBeUndefined();
    expect(resolved.request.onError).toBeUndefined();
    expect(resolved.request.onRequest).toBeUndefined();
    expect(resolved.request.onResponse).toBeUndefined();
    expect(resolved.request.onFinally).toBeUndefined();
    expect(resolved.request.onLoading).toBeUndefined();
  });

  it('should pass through onRetry callback', () => {
    const onRetry = vi.fn();
    const resolved = resolveConfig({ ...baseConfig, request: { onRetry } });

    expect(resolved.request.onRetry).toBe(onRetry);
  });

  it('should pass through onError callback', () => {
    const onError = vi.fn();
    const resolved = resolveConfig({ ...baseConfig, request: { onError } });

    expect(resolved.request.onError).toBe(onError);
  });

  it('should pass through onRequest callback', () => {
    const onRequest = vi.fn();
    const resolved = resolveConfig({ ...baseConfig, request: { onRequest } });

    expect(resolved.request.onRequest).toBe(onRequest);
  });

  it('should pass through onResponse callback', () => {
    const onResponse = vi.fn();
    const resolved = resolveConfig({
      ...baseConfig,
      request: { onResponse },
    });

    expect(resolved.request.onResponse).toBe(onResponse);
  });

  it('should pass through onFinally callback', () => {
    const onFinally = vi.fn();
    const resolved = resolveConfig({
      ...baseConfig,
      request: { onFinally },
    });

    expect(resolved.request.onFinally).toBe(onFinally);
  });

  it('should pass through onLoading callback', () => {
    const onLoading = vi.fn();
    const resolved = resolveConfig({
      ...baseConfig,
      request: { onLoading },
    });

    expect(resolved.request.onLoading).toBe(onLoading);
  });

  it('should pass through all callbacks together', () => {
    const callbacks = {
      onRetry: vi.fn(),
      onError: vi.fn(),
      onRequest: vi.fn(),
      onResponse: vi.fn(),
      onFinally: vi.fn(),
      onLoading: vi.fn(),
    };

    const resolved = resolveConfig({
      ...baseConfig,
      request: { ...callbacks },
    });

    expect(resolved.request.onRetry).toBe(callbacks.onRetry);
    expect(resolved.request.onError).toBe(callbacks.onError);
    expect(resolved.request.onRequest).toBe(callbacks.onRequest);
    expect(resolved.request.onResponse).toBe(callbacks.onResponse);
    expect(resolved.request.onFinally).toBe(callbacks.onFinally);
    expect(resolved.request.onLoading).toBe(callbacks.onLoading);
  });

  it('should preserve callbacks when retry is also configured', () => {
    const onError = vi.fn();
    const onRequest = vi.fn();

    const resolved = resolveConfig({
      ...baseConfig,
      request: {
        onError,
        onRequest,
        retry: {
          enabled: true,
          maxRetries: 2,
        },
      },
    });

    expect(resolved.request.onError).toBe(onError);
    expect(resolved.request.onRequest).toBe(onRequest);
    expect(resolved.request.retry.enabled).toBe(true);
    expect(resolved.request.retry.maxRetries).toBe(2);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sdk } from '../../../sdk.js';
import * as api from '../../../services/api.js';
import type { SdkConfig } from '../../../configs/sdk.config.js';

describe('Sdk axiosConfig', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('passes axiosConfig to createHttpClient when provided', async () => {
    const sdk = new Sdk();
    const createHttpClientSpy = vi.spyOn(api, 'createHttpClient');

    const config: SdkConfig = {
      baseUrl: 'https://example.test',
      axiosConfig: {
        timeout: 5000,
        headers: {
          'X-Custom-Header': 'test-value',
        },
      },
    };

    await sdk.init(config);

    expect(createHttpClientSpy).toHaveBeenCalledWith({
      baseURL: 'https://example.test',
      timeout: 5000,
      headers: {
        'X-Custom-Header': 'test-value',
      },
    });
  });

  it('works correctly when axiosConfig is undefined', async () => {
    const sdk = new Sdk();
    const createHttpClientSpy = vi.spyOn(api, 'createHttpClient');

    const config: SdkConfig = {
      baseUrl: 'https://example2.test',
    };

    await sdk.init(config);

    expect(createHttpClientSpy).toHaveBeenCalledWith({
      baseURL: 'https://example2.test',
    });
  });

  it('axiosConfig can override baseURL if explicitly provided', async () => {
    const sdk = new Sdk();
    const createHttpClientSpy = vi.spyOn(api, 'createHttpClient');

    const config: SdkConfig = {
      baseUrl: 'https://example.test',
      axiosConfig: {
        baseURL: 'https://overridden.test', // This would override
        timeout: 3000,
      },
    };

    await sdk.init(config);

    // The spread puts axiosConfig after baseURL, so it can override
    expect(createHttpClientSpy).toHaveBeenCalledWith({
      baseURL: 'https://overridden.test',
      timeout: 3000,
    });
  });
});

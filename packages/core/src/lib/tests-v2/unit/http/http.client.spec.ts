import { describe, it, expect } from 'vitest';
import { createHttpClient, httpClient } from '../../../http/http.client.js';

describe('http.client', () => {
  it('createHttpClient returns an axios instance', () => {
    const client = createHttpClient({ baseURL: 'https://store.test' });
    expect(client).toBeDefined();
    expect(typeof client.get).toBe('function');
  });

  it('createHttpClient is idempotent — returns the same instance on repeat calls', () => {
    const first = createHttpClient({ baseURL: 'https://store.test' });
    const second = createHttpClient({ baseURL: 'https://other.test' });
    expect(first).toBe(second);
  });

  it('httpClient proxy forwards method access to underlying axios instance', () => {
    // httpClient is a Proxy — ensure it forwards property access
    expect(typeof httpClient.get).toBe('function');
    expect(typeof httpClient.post).toBe('function');
    expect(typeof httpClient.put).toBe('function');
    expect(typeof httpClient.delete).toBe('function');
    expect(typeof httpClient.interceptors).toBe('object');
  });
});

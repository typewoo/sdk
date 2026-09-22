import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';

const config = {
  baseUrl: 'https://store.test',
  uniqueIdentifier: 'test',
} as ResolvedSdkConfig;

// Fresh module per test so the default context starts empty
let mod: typeof import('../../../http/http.client.js');
beforeEach(async () => {
  vi.resetModules();
  mod = await import('../../../http/http.client.js');
});

describe('http.client', () => {
  it('resolveHttpContext throws before any instance exists', () => {
    expect(() => mod.resolveHttpContext()).toThrow(/createTypewoo/);
  });

  it('resolveHttpContext returns an explicit context over the default', () => {
    const first = { client: axios.create(), config };
    const explicit = { client: axios.create(), config };
    mod.setDefaultHttpContext(first);
    expect(mod.resolveHttpContext(explicit)).toBe(explicit);
  });

  it('keeps the first registered context as the default', () => {
    const first = { client: axios.create(), config };
    const second = { client: axios.create(), config };
    mod.setDefaultHttpContext(first);
    mod.setDefaultHttpContext(second);
    expect(mod.resolveHttpContext()).toBe(first);
  });

  it('httpClient proxy forwards to the default context client', () => {
    const client = axios.create();
    mod.setDefaultHttpContext({ client, config });
    expect(mod.httpClient.interceptors).toBe(client.interceptors);
    expect(typeof mod.httpClient.get).toBe('function');
  });
});

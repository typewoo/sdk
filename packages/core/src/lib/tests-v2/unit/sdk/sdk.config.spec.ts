import { describe, it, expect, vi } from 'vitest';
import { resolveConfig } from '../../../configs/sdk.config.js';
import { memoryStorageProvider } from '../../../storage/auth.storage.js';

describe('resolveConfig()', () => {
  it('preserves baseUrl exactly as provided', () => {
    const cfg = resolveConfig({ baseUrl: 'https://shop.example.com' });
    expect(cfg.baseUrl).toBe('https://shop.example.com');
  });

  it('generates a uniqueIdentifier when not provided', () => {
    const cfg = resolveConfig({ baseUrl: 'https://store.test' });
    expect(typeof cfg.uniqueIdentifier).toBe('string');
    expect(cfg.uniqueIdentifier.length).toBeGreaterThan(0);
  });

  it('uses string uniqueIdentifier as-is', () => {
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      uniqueIdentifier: 'sdk-v1',
    });
    expect(cfg.uniqueIdentifier).toBe('sdk-v1');
  });

  it('calls uniqueIdentifier function to resolve', () => {
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      uniqueIdentifier: () => 'fn-result',
    });
    expect(cfg.uniqueIdentifier).toBe('fn-result');
  });

  it('defaults request.retry.enabled to false', () => {
    const cfg = resolveConfig({ baseUrl: 'https://store.test' });
    expect(cfg.request.retry.enabled).toBe(false);
  });

  it('forwards admin credentials', () => {
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      admin: { consumer_key: 'ck_abc', consumer_secret: 'cs_abc' },
    });
    expect(cfg.admin?.consumer_key).toBe('ck_abc');
    expect(cfg.admin?.consumer_secret).toBe('cs_abc');
  });

  it('accepts a StorageProvider instance directly', () => {
    const storage = memoryStorageProvider();
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      auth: { accessToken: { storage } },
    });
    expect(cfg.auth?.accessToken?.storage).toBe(storage);
  });

  it('resolves "memory" storage string to a memory provider', () => {
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      auth: { accessToken: { storage: 'memory' } },
    });
    expect(cfg.auth?.accessToken?.storage.type).toBe('memory');
  });

  it('forwards global request callbacks', () => {
    const onError = vi.fn();
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      request: { onError },
    });
    expect(cfg.request.onError).toBe(onError);
  });
});

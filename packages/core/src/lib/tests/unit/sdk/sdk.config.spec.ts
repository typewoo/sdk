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

  it('keeps the disabled flag of nonce and cart token, without storage', () => {
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      nonce: { disabled: true },
      cartToken: { disabled: true },
    });
    expect(cfg.nonce?.disabled).toBe(true);
    expect(cfg.nonce?.storage).toBeUndefined();
    expect(cfg.cartToken?.disabled).toBe(true);
    expect(cfg.cartToken?.storage).toBeUndefined();
  });

  it('keeps the auth options when the access token is disabled', () => {
    const cfg = resolveConfig({
      baseUrl: 'https://store.test',
      auth: {
        autoLoginUrl: 'https://login.store.test',
        fetchCartOnLogin: true,
        revokeTokenBeforeLogin: true,
        clearSessionOnAuthChange: false,
        accessToken: { disabled: true },
      },
    });
    expect(cfg.auth?.autoLoginUrl).toBe('https://login.store.test');
    expect(cfg.auth?.fetchCartOnLogin).toBe(true);
    expect(cfg.auth?.revokeTokenBeforeLogin).toBe(true);
    expect(cfg.auth?.clearSessionOnAuthChange).toBe(false);
    expect(cfg.auth?.accessToken).toBeUndefined();
    expect(cfg.auth?.refreshToken).toBeUndefined();
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

import { describe, it, expect } from 'vitest';
import { Sdk } from '../../../sdk.js';

describe('Sdk guard', () => {
  it('throws accessing store before init()', () => {
    const sdk = new Sdk();
    expect(() => sdk.store).toThrow(/SDK not initialized/);
  });

  it('throws accessing admin before init()', () => {
    const sdk = new Sdk();
    expect(() => sdk.admin).toThrow(/SDK not initialized/);
  });

  it('throws accessing analytics before init()', () => {
    const sdk = new Sdk();
    expect(() => sdk.analytics).toThrow(/SDK not initialized/);
  });

  it('throws accessing auth before init()', () => {
    const sdk = new Sdk();
    expect(() => sdk.auth).toThrow(/SDK not initialized/);
  });

  it('throws accessing config before init()', () => {
    const sdk = new Sdk();
    expect(() => sdk.config).toThrow(/SDK not initialized/);
  });

  it('does not throw after init()', async () => {
    const sdk = new Sdk();
    await sdk.init({ baseUrl: 'https://store.test' });
    expect(() => sdk.store).not.toThrow();
    expect(() => sdk.admin).not.toThrow();
    expect(() => sdk.analytics).not.toThrow();
  });

  it('second init() call is a no-op (stays initialized)', async () => {
    const sdk = new Sdk();
    await sdk.init({ baseUrl: 'https://store.test' });
    // Should not throw — second init is silently ignored
    await expect(
      sdk.init({ baseUrl: 'https://other.test' })
    ).resolves.toBeUndefined();
    // Config stays from first init
    expect(sdk.config.baseUrl).toBe('https://store.test');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  memoryStorageProvider,
  localStorageProvider,
  sessionStorageProvider,
} from '../../../storage/auth.storage.js';

describe('memoryStorageProvider', () => {
  it('has type "memory"', () => {
    expect(memoryStorageProvider().type).toBe('memory');
  });

  it('returns null before any value is set', async () => {
    const p = memoryStorageProvider();
    expect(await p.get()).toBeNull();
  });

  it('stores and retrieves a string value', async () => {
    const p = memoryStorageProvider();
    await p.set('my-token');
    expect(await p.get()).toBe('my-token');
  });

  it('clear() resets value to null', async () => {
    const p = memoryStorageProvider();
    await p.set('my-token');
    await p.clear();
    expect(await p.get()).toBeNull();
  });

  it('overwrite — last set wins', async () => {
    const p = memoryStorageProvider();
    await p.set('first');
    await p.set('second');
    expect(await p.get()).toBe('second');
  });

  it('each instance has isolated state', async () => {
    const a = memoryStorageProvider();
    const b = memoryStorageProvider();
    await a.set('alpha');
    expect(await b.get()).toBeNull();
  });
});

describe('localStorageProvider (Node.js environment)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('falls back to memory in SSR/Node.js (no window.localStorage)', () => {
    const p = localStorageProvider('access-token');
    expect(p.type).toBe('memory');
  });

  it('warns about SSR fallback', () => {
    localStorageProvider('my-key');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('localStorage is not available')
    );
  });

  it('includes the storage key in the warning message', () => {
    localStorageProvider('refresh-token');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('refresh-token')
    );
  });

  it('suppresses warning when silent=true', () => {
    localStorageProvider('access-token', true);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('memory fallback stores and retrieves values correctly', async () => {
    const p = localStorageProvider('my-key', true);
    await p.set('fallback-val');
    expect(await p.get()).toBe('fallback-val');
  });
});

describe('sessionStorageProvider (Node.js environment)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('falls back to memory in SSR/Node.js', () => {
    const p = sessionStorageProvider('cart-token');
    expect(p.type).toBe('memory');
  });

  it('warns about SSR fallback', () => {
    sessionStorageProvider('session-key');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('sessionStorage is not available')
    );
  });

  it('suppresses warning when silent=true', () => {
    sessionStorageProvider('session-key', true);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

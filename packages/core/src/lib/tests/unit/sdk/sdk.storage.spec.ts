import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  memoryStorageProvider,
  localStorageProvider,
  sessionStorageProvider,
} from '../../../storage/auth.storage.js';

describe('memoryStorageProvider', () => {
  it('returns null initially', async () => {
    const p = memoryStorageProvider();
    expect(await p.get()).toBeNull();
  });

  it('stores and retrieves a value', async () => {
    const p = memoryStorageProvider();
    await p.set('tok-abc');
    expect(await p.get()).toBe('tok-abc');
  });

  it('clears stored value', async () => {
    const p = memoryStorageProvider();
    await p.set('tok-abc');
    await p.clear();
    expect(await p.get()).toBeNull();
  });

  it('has type "memory"', () => {
    expect(memoryStorageProvider().type).toBe('memory');
  });

  it('isolates state across instances', async () => {
    const a = memoryStorageProvider();
    const b = memoryStorageProvider();
    await a.set('alpha');
    await b.set('beta');
    expect(await a.get()).toBe('alpha');
    expect(await b.get()).toBe('beta');
  });
});

describe('localStorageProvider (Node.js/SSR)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('falls back to memory when localStorage unavailable', () => {
    const p = localStorageProvider('my-key');
    expect(p.type).toBe('memory');
  });

  it('warns about the fallback (with the key name)', () => {
    localStorageProvider('access-token');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('access-token')
    );
  });

  it('suppresses warning when silent=true', () => {
    localStorageProvider('access-token', true);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('sessionStorageProvider (Node.js/SSR)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('falls back to memory when sessionStorage unavailable', () => {
    const p = sessionStorageProvider('my-key');
    expect(p.type).toBe('memory');
  });

  it('suppresses warning when silent=true', () => {
    sessionStorageProvider('refresh-token', true);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

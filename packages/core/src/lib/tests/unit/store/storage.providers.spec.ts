import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  StorageProvider,
  memoryStorageProvider,
  localStorageProvider,
  sessionStorageProvider,
  storageProviders,
} from '../../../utilities/storage.providers.js';
import { resolveStorageProvider } from '../../../configs/sdk.config.js';

describe('Storage Providers', () => {
  describe('memoryStorageProvider', () => {
    it('should create a provider with type "memory"', () => {
      const provider = memoryStorageProvider();
      expect(provider.type).toBe('memory');
    });

    it('should return null initially', async () => {
      const provider = memoryStorageProvider();
      const value = await provider.get();
      expect(value).toBeNull();
    });

    it('should store and retrieve values', async () => {
      const provider = memoryStorageProvider();
      await provider.set('test-token');
      const value = await provider.get();
      expect(value).toBe('test-token');
    });

    it('should clear stored values', async () => {
      const provider = memoryStorageProvider();
      await provider.set('test-token');
      await provider.clear();
      const value = await provider.get();
      expect(value).toBeNull();
    });

    it('should accept optional key parameter for API consistency', () => {
      const provider = memoryStorageProvider('some-key');
      expect(provider.type).toBe('memory');
    });

    it('should maintain isolated state per instance', async () => {
      const provider1 = memoryStorageProvider();
      const provider2 = memoryStorageProvider();

      await provider1.set('value1');
      await provider2.set('value2');

      expect(await provider1.get()).toBe('value1');
      expect(await provider2.get()).toBe('value2');
    });
  });

  describe('localStorageProvider (Node.js/SSR environment)', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should fallback to memory storage in Node.js environment', () => {
      const provider = localStorageProvider('test-key');
      // In Node.js, localStorage is not available, so it should fallback to memory
      expect(provider.type).toBe('memory');
    });

    it('should warn when falling back to memory storage', () => {
      localStorageProvider('my-token-key');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('localStorage is not available')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('my-token-key')
      );
    });

    it('should function correctly with memory fallback', async () => {
      const provider = localStorageProvider('test-key');
      await provider.set('fallback-value');
      expect(await provider.get()).toBe('fallback-value');
      await provider.clear();
      expect(await provider.get()).toBeNull();
    });
  });

  describe('sessionStorageProvider (Node.js/SSR environment)', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should fallback to memory storage in Node.js environment', () => {
      const provider = sessionStorageProvider('test-key');
      expect(provider.type).toBe('memory');
    });

    it('should warn when falling back to memory storage', () => {
      sessionStorageProvider('session-key');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('sessionStorage is not available')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('session-key')
      );
    });

    it('should function correctly with memory fallback', async () => {
      const provider = sessionStorageProvider('test-key');
      await provider.set('session-value');
      expect(await provider.get()).toBe('session-value');
      await provider.clear();
      expect(await provider.get()).toBeNull();
    });
  });

  describe('storageProviders object', () => {
    it('should expose all provider factories', () => {
      expect(storageProviders.localstorage).toBe(localStorageProvider);
      expect(storageProviders.sessionstorage).toBe(sessionStorageProvider);
      expect(storageProviders.memory).toBe(memoryStorageProvider);
    });

    it('should allow creating providers via object access', () => {
      const provider = storageProviders.memory('key');
      expect(provider.type).toBe('memory');
    });
  });
});

describe('resolveStorageProvider', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('with undefined storage', () => {
    it('should return localStorage provider by default', () => {
      const provider = resolveStorageProvider(undefined, 'test-key');
      // In Node.js, this falls back to memory, but the intent is localStorage
      expect(provider).toBeDefined();
      expect(typeof provider.get).toBe('function');
      expect(typeof provider.set).toBe('function');
      expect(typeof provider.clear).toBe('function');
    });

    it('should use custom default type when specified', () => {
      const provider = resolveStorageProvider(undefined, 'test-key', 'memory');
      expect(provider.type).toBe('memory');
    });
  });

  describe('with string storage type', () => {
    it('should resolve "localstorage" string to provider', () => {
      const provider = resolveStorageProvider('localstorage', 'my-key');
      expect(provider).toBeDefined();
      // Falls back to memory in Node.js
      expect(provider.type).toBe('memory');
    });

    it('should resolve "sessionstorage" string to provider', () => {
      const provider = resolveStorageProvider('sessionstorage', 'my-key');
      expect(provider).toBeDefined();
      expect(provider.type).toBe('memory');
    });

    it('should resolve "memory" string to provider', () => {
      const provider = resolveStorageProvider('memory', 'my-key');
      expect(provider.type).toBe('memory');
    });
  });

  describe('with custom StorageProvider', () => {
    it('should return the custom provider as-is', () => {
      const customProvider: StorageProvider = {
        type: 'memory',
        get: () => Promise.resolve('custom-value'),
        set: () => Promise.resolve(),
        clear: () => Promise.resolve(),
      };

      const resolved = resolveStorageProvider(customProvider, 'ignored-key');
      expect(resolved).toBe(customProvider);
    });

    it('should not modify custom provider', async () => {
      let storedValue: string | null = null;
      const customProvider: StorageProvider = {
        get: () => Promise.resolve(storedValue),
        set: (v) => {
          storedValue = v;
          return Promise.resolve();
        },
        clear: () => {
          storedValue = null;
          return Promise.resolve();
        },
      };

      const resolved = resolveStorageProvider(customProvider, 'key');
      await resolved.set('test');
      expect(await resolved.get()).toBe('test');
      expect(storedValue).toBe('test');
    });
  });

  describe('key parameter usage', () => {
    it('should pass key to memory provider for storage isolation', async () => {
      const provider1 = resolveStorageProvider('memory', 'key1');
      const provider2 = resolveStorageProvider('memory', 'key2');

      await provider1.set('value1');
      await provider2.set('value2');

      // Memory providers are isolated per instance
      expect(await provider1.get()).toBe('value1');
      expect(await provider2.get()).toBe('value2');
    });
  });
});

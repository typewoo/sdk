export type StorageType = 'localstorage' | 'sessionstorage';
export interface StorageProvider {
  type?: StorageType;
  get: () => Promise<string | null>;
  set: (value: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const localStorageProvider = (key: string): StorageProvider => ({
  type: 'localstorage',
  get: () => Promise.resolve(localStorage.getItem(key)),
  set: (token: string) =>
    Promise.resolve(void localStorage.setItem(key, token)),
  clear: () => Promise.resolve(void localStorage.removeItem(key)),
});

export const sessionStorageProvider = (key: string): StorageProvider => ({
  type: 'sessionstorage',
  get: () => Promise.resolve(sessionStorage.getItem(key)),
  set: (token: string) =>
    Promise.resolve(void sessionStorage.setItem(key, token)),
  clear: () => Promise.resolve(void sessionStorage.removeItem(key)),
});

export const storageProviders = {
  localstorage: localStorageProvider,
  sessionstorage: sessionStorageProvider,
};

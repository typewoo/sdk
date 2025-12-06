import {
  StorageProvider,
  storageProviders,
  StorageType,
} from '../utilities/storage.providers.js';

export interface SdkConfig {
  baseUrl: string;
  admin?: {
    consumer_key?: string;
    consumer_secret?: string;
    useAuthInterceptor?: boolean;
  };
  auth?: {
    autoLoginUrl?: string;
    /**
     * Fetch the cart after login.
     * This is useful if you want to ensure the cart is up-to-date after a user logs in.
     * It will trigger a cart request after the login process.
     * Defaults to `false`.
     */
    fetchCartOnLogin?: boolean;
    /**
     * Revoke the token before login.
     * This is useful if you want to ensure the token is cleared before a new login attempt.
     * Defaults to `false`.
     */
    revokeTokenBeforeLogin?: boolean;

    accessToken?: {
      key?: string;
      disabled?: boolean;
      storage?: StorageType | StorageProvider;
      useInterceptor?: boolean;
    };
    refreshToken?: {
      key?: string;
      disabled?: boolean;
      storage?: StorageType | StorageProvider;
      useInterceptor?: boolean;
    };
  };
  nonce?: {
    key?: string;
    disabled?: boolean;
    storage?: StorageType | StorageProvider;
  };
  cartToken?: {
    key?: string;
    disabled?: boolean;
    storage?: StorageType | StorageProvider;
  };
}

/**
 * Resolves a storage configuration to a StorageProvider instance.
 * If a string is provided, it creates the appropriate provider with the given key.
 * If a StorageProvider is provided, it returns it as-is.
 */
export const resolveStorageProvider = (
  storage: StorageType | StorageProvider | undefined,
  key: string,
  defaultType: StorageType = 'localstorage'
): StorageProvider => {
  if (!storage) {
    return storageProviders[defaultType](key);
  }
  if (typeof storage === 'string') {
    return storageProviders[storage](key);
  }
  return storage;
};

import {
  StorageProvider,
  storageProviders,
  StorageType,
} from '../utilities/storage.providers.js';

/**
 * Configuration interface for the SDK.
 * This is the input type - storage can be either a string type or a provider instance.
 */
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
 * Resolved storage configuration where storage is always a StorageProvider instance.
 * Used internally after SDK initialization.
 */
interface ResolvedStorageConfig {
  key?: string;
  disabled?: boolean;
  storage: StorageProvider;
  useInterceptor?: boolean;
}

/**
 * Internal configuration type after storage providers have been resolved.
 * All storage fields are guaranteed to be StorageProvider instances (not string types).
 * This type is used internally by services and interceptors after SDK initialization.
 */
export interface ResolvedSdkConfig {
  baseUrl: string;
  admin?: {
    consumer_key?: string;
    consumer_secret?: string;
    useAuthInterceptor?: boolean;
  };
  auth?: {
    autoLoginUrl?: string;
    fetchCartOnLogin?: boolean;
    revokeTokenBeforeLogin?: boolean;
    accessToken?: ResolvedStorageConfig;
    refreshToken?: ResolvedStorageConfig;
  };
  nonce?: {
    key?: string;
    disabled?: boolean;
    storage: StorageProvider;
  };
  cartToken?: {
    key?: string;
    disabled?: boolean;
    storage: StorageProvider;
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

/**
 * Resolves all storage providers in the config, returning a ResolvedSdkConfig.
 * This ensures all storage fields are StorageProvider instances.
 */
export const resolveConfig = (config: SdkConfig): ResolvedSdkConfig => {
  const resolved: ResolvedSdkConfig = {
    baseUrl: config.baseUrl,
    admin: config.admin,
  };

  // Resolve auth storage providers
  // Auth is always initialized unless access token is explicitly disabled
  const accessTokenDisabled = config.auth?.accessToken?.disabled === true;
  const refreshTokenDisabled = config.auth?.refreshToken?.disabled === true;

  if (!accessTokenDisabled) {
    resolved.auth = {
      autoLoginUrl: config.auth?.autoLoginUrl,
      fetchCartOnLogin: config.auth?.fetchCartOnLogin,
      revokeTokenBeforeLogin: config.auth?.revokeTokenBeforeLogin,
      accessToken: {
        key: config.auth?.accessToken?.key,
        disabled: config.auth?.accessToken?.disabled,
        useInterceptor: config.auth?.accessToken?.useInterceptor,
        storage: resolveStorageProvider(
          config.auth?.accessToken?.storage,
          config.auth?.accessToken?.key ?? 'typewoo_access_token'
        ),
      },
    };

    if (!refreshTokenDisabled) {
      resolved.auth.refreshToken = {
        key: config.auth?.refreshToken?.key,
        disabled: config.auth?.refreshToken?.disabled,
        useInterceptor: config.auth?.refreshToken?.useInterceptor,
        storage: resolveStorageProvider(
          config.auth?.refreshToken?.storage,
          config.auth?.refreshToken?.key ?? 'typewoo_refresh_token'
        ),
      };
    }
  }

  // Resolve cart token storage
  if (!config.cartToken?.disabled) {
    resolved.cartToken = {
      key: config.cartToken?.key,
      disabled: config.cartToken?.disabled,
      storage: resolveStorageProvider(
        config.cartToken?.storage,
        config.cartToken?.key ?? 'typewoo_cart_token'
      ),
    };
  }

  // Resolve nonce storage
  if (!config.nonce?.disabled) {
    resolved.nonce = {
      key: config.nonce?.key,
      disabled: config.nonce?.disabled,
      storage: resolveStorageProvider(
        config.nonce?.storage,
        config.nonce?.key ?? 'typewoo_nonce'
      ),
    };
  }

  return resolved;
};

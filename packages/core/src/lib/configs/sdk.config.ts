import { AxiosRequestConfig, Method } from 'axios';
import { DEFAULT_RETRY_CONFIG } from '../http/http.helper.js';
import {
  StorageType,
  StorageProvider,
  storageProviders,
} from '../storage/auth.storage.js';

let resolvedSdkConfig: ResolvedSdkConfig | null = null;

export function setSdkConfig(config: ResolvedSdkConfig): void {
  resolvedSdkConfig = config;
}

export function getSdkConfig(): ResolvedSdkConfig | null {
  return resolvedSdkConfig;
}

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
  axiosConfig?: AxiosRequestConfig;
  request?: {
    /**
     * Retry configuration for failed requests.
     * Automatically retries requests that fail due to network issues or specific HTTP status codes.
     */
    retry?: {
      /**
       * Whether retry is enabled. Defaults to `false`.
       */
      enabled?: boolean;
      /**
       * Maximum number of retry attempts.
       * Can be a number or a function that returns a number (useful for dynamic retry counts).
       * Defaults to `3`.
       */
      maxRetries?: number | (() => number);
      /**
       * Delay between retries in milliseconds.
       * Can be a number for fixed delay, or a function receiving attempt number for exponential backoff.
       * Example exponential: `(attempt) => Math.min(1000 * 2 ** attempt, 30000)`
       * Defaults to `1000` (1 second).
       */
      delay?: number | ((attempt: number) => number);
      /**
       * HTTP status codes that should trigger a retry.
       * Defaults to `[408, 429, 500, 502, 503, 504]`.
       */
      retryOnStatus?: number[];
      /**
       * HTTP methods that are safe to retry.
       * Defaults to `['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']`.
       * Note: POST is excluded by default as it may not be idempotent.
       */
      retryOnMethods?: Method[];
      /**
       * Custom condition to determine if a request should be retried.
       * Receives the error and attempt number. Return `true` to retry.
       * This is called in addition to status/method checks.
       */
      retryCondition?: (error: unknown, attempt: number) => boolean;
    };
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
  axiosConfig?: AxiosRequestConfig;
  request: {
    retry: {
      enabled: boolean;
      maxRetries?: number | (() => number);
      delay?: number | ((attempt: number) => number);
      retryOnStatus?: number[];
      retryOnMethods?: Method[];
      retryCondition?: (error: unknown, attempt: number) => boolean;
    };
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
    axiosConfig: config.axiosConfig,
    request: {
      retry: {
        enabled: false,
      },
    },
  };

  if (config.request?.retry) {
    resolved.request.retry = {
      enabled: config.request.retry.enabled ?? false,
      delay: config.request.retry.delay ?? DEFAULT_RETRY_CONFIG.delay,
      retryOnMethods:
        config.request.retry.retryOnMethods ??
        DEFAULT_RETRY_CONFIG.retryOnMethods,
      retryOnStatus:
        config.request.retry.retryOnStatus ??
        DEFAULT_RETRY_CONFIG.retryOnStatus,
      maxRetries:
        config.request.retry.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries,
      retryCondition: config.request?.retry.retryCondition,
    };
  }

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

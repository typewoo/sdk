import {
  CustomEndpoints,
  resolveConfig,
  ResolvedSdkConfig,
  SdkConfig,
  setSdkConfig,
} from './configs/sdk.config.js';
import { SdkState } from './types/sdk.state.js';
import { createHttpClient } from './http/http.client.js';
import { addCartTokenInterceptors } from './interceptors/cart.token.interceptor.js';
import { addNonceInterceptors } from './interceptors/nonce.interceptor.js';
import { StoreService } from './services/store.service.js';
import { SdkEvent } from './sdk.events.js';
import { EventBus } from './bus/event.bus.js';
import { addTokenInterceptor } from './interceptors/token.interceptor.js';
import { AuthService } from './services/auth/auth.service.js';
import { addRefreshTokenInterceptor } from './interceptors/refresh.token.interceptor.js';
import { AdminService } from './services/admin.service.js';
import { addAdminAuthInterceptor } from './interceptors/admin-auth.interceptor.js';

/**
 * Create a fully typed Typewoo SDK instance.
 *
 * This is the recommended way to initialize the SDK when using custom endpoints,
 * as it provides full TypeScript inference for your endpoint functions.
 *
 * @example
 * ```typescript
 * import { createTypewoo, doGet, doPost, RequestOptions } from '@typewoo/core';
 *
 * // Create your typed SDK instance
 * export const typewoo = createTypewoo({
 *   baseUrl: 'https://mystore.com',
 *   endpoints: {
 *     posts: (options?: RequestOptions) => doGet(`/wp/v2/posts`, options),
 *     pages: () => doPost(`/wp/v2/pages`),
 *
 *     // using different baseUrl
 *     pages: () => doGet(`https://another-store.com/wp/v2/comments`),
 *   },
 * });
 *
 * // Full autocomplete and type checking!
 * const { data } = await typewoo.endpoints.posts();
 * const products = await typewoo.store.products.list();
 * ```
 *
 * @param config - SDK configuration with optional custom endpoints
 * @returns A fully typed SDK instance
 */

export const createTypewoo = <
  TEndpoints extends CustomEndpoints = Record<string, never>
>(
  config: SdkConfig<TEndpoints>
) => {
  return new TypewooClient<TEndpoints>(config);
};

export class TypewooClient<
  TEndpoints extends CustomEndpoints = Record<string, never>
> {
  private _auth!: AuthService;
  private _store!: StoreService;
  private _admin!: AdminService;
  private _config!: ResolvedSdkConfig;

  private _endpoints!: TEndpoints;

  state: SdkState = {};
  events = new EventBus<SdkEvent>();

  constructor(config: SdkConfig<TEndpoints>) {
    // Resolve all storage providers to ensure type safety
    this._config = resolveConfig(config);

    // Store original config for retry logic access
    setSdkConfig(this._config);

    // Store custom endpoints
    this._endpoints = (config.endpoints ?? {}) as TEndpoints;

    this._auth = new AuthService(this.state, this._config, this.events);
    this._store = new StoreService(this.state, this._config, this.events);
    this._admin = new AdminService(this.state, this._config, this.events);

    createHttpClient({
      baseURL: this._config.baseUrl,
      ...this._config.axiosConfig,
    });

    addNonceInterceptors(this._config, this.state, this.events);
    addCartTokenInterceptors(this._config, this.state, this.events);

    if (!config.auth?.accessToken?.disabled) {
      const useTokenInterceptor =
        this._config.auth?.accessToken?.useInterceptor ?? true;
      if (useTokenInterceptor) {
        addTokenInterceptor(this._config);
      }
    }

    if (
      !config.auth?.accessToken?.disabled &&
      !config.auth?.refreshToken?.disabled
    ) {
      const useRefreshTokenInterceptor =
        this._config.auth?.refreshToken?.useInterceptor ?? true;
      if (useRefreshTokenInterceptor) {
        addRefreshTokenInterceptor(this._config, this._auth);
      }
    }

    if (
      this._config.admin?.consumer_key &&
      this._config.admin.consumer_secret
    ) {
      if (this._config.admin.useAuthInterceptor !== false) {
        addAdminAuthInterceptor(this._config);
      }
    }

    // Set initial authentication state based on stored token
    const accessTokenStorage = this._config.auth?.accessToken?.storage;
    if (accessTokenStorage) {
      accessTokenStorage.get().then((value) => {
        this.state.authenticated = !!value;
        this.events.emit('auth:changed', !!value);
      });
    }
  }

  /**
   * Resolved SDK configuration.
   * Storage fields are guaranteed to be StorageProvider instances after initialization.
   */
  get config(): ResolvedSdkConfig {
    return this._config;
  }

  /**
   * Auth API
   */
  get auth() {
    return this._auth;
  }

  /**
   * Store API
   */
  get store() {
    return this._store;
  }

  /**
   * Admin API
   */
  get admin() {
    return this._admin;
  }

  /**
   * Custom endpoints defined in the SDK configuration.
   *
   * For full type inference on custom endpoints, use `createTypewoo()` instead:
   * @example
   * ```typescript
   * const typewoo = createTypewoo({
   *   baseUrl: 'https://mystore.com',
   *   endpoints: {
   *     getNotifications: (userId: string) => doGet<Notification[]>(`/notifications/${userId}`),
   *   },
   * });
   *
   * // Full type inference:
   * const { data } = await typewoo.endpoints.getNotifications('user-123');
   * ```
   */
  get endpoints(): TEndpoints {
    return this._endpoints;
  }
}

export class Sdk {
  private _config!: ResolvedSdkConfig;
  state: SdkState = {};

  private _auth!: AuthService;
  private _store!: StoreService;
  private _admin!: AdminService;

  private _initialized = false;

  events = new EventBus<SdkEvent>();

  public async init(config: SdkConfig): Promise<void> {
    if (this._initialized) return;

    // Resolve all storage providers to ensure type safety
    this._config = resolveConfig(config);

    // Store original config for retry logic access
    setSdkConfig(this._config);

    this._auth = new AuthService(this.state, this._config, this.events);
    this._store = new StoreService(this.state, this._config, this.events);
    this._admin = new AdminService(this.state, this._config, this.events);

    createHttpClient({
      baseURL: this._config.baseUrl,
      ...this._config.axiosConfig,
    });

    addNonceInterceptors(this._config, this.state, this.events);
    addCartTokenInterceptors(this._config, this.state, this.events);

    if (!config.auth?.accessToken?.disabled) {
      const useTokenInterceptor =
        this._config.auth?.accessToken?.useInterceptor ?? true;
      if (useTokenInterceptor) {
        addTokenInterceptor(this._config);
      }
    }

    if (
      !config.auth?.accessToken?.disabled &&
      !config.auth?.refreshToken?.disabled
    ) {
      const useRefreshTokenInterceptor =
        this._config.auth?.refreshToken?.useInterceptor ?? true;
      if (useRefreshTokenInterceptor) {
        addRefreshTokenInterceptor(this._config, this._auth);
      }
    }

    if (
      this._config.admin?.consumer_key &&
      this._config.admin.consumer_secret
    ) {
      if (this._config.admin.useAuthInterceptor !== false) {
        addAdminAuthInterceptor(this._config);
      }
    }

    // Set initial authentication state based on stored token
    const accessTokenStorage = this._config.auth?.accessToken?.storage;
    if (accessTokenStorage) {
      const storedToken = await accessTokenStorage.get();
      this.state.authenticated = !!storedToken;
      this.events.emit('auth:changed', !!storedToken);
    }

    this._initialized = true;

    // TODO: Conditional from config
    // await this._store.cart.get();
  }

  /**
   * Resolved SDK configuration.
   * Storage fields are guaranteed to be StorageProvider instances after initialization.
   */
  get config(): ResolvedSdkConfig {
    this.throwIfNotInitized();
    return this._config;
  }

  /**
   * Auth API
   */
  get auth() {
    this.throwIfNotInitized();
    return this._auth;
  }

  /**
   * Store API
   */
  get store() {
    this.throwIfNotInitized();
    return this._store;
  }

  /**
   * Admin API
   */
  get admin() {
    this.throwIfNotInitized();
    return this._admin;
  }

  private throwIfNotInitized() {
    if (this._initialized) return;
    throw new Error('SDK not initialized. Call `await Typewoo.init()` first.');
  }
}

/**
 * Default Typewoo singleton instance.
 *
 * For simple usage without custom endpoints:
 * @example
 * ```typescript
 * await Typewoo.init({ baseUrl: 'https://mystore.com' });
 * const products = await Typewoo.store.products.list();
 * ```
 *
 * For custom endpoints with full type inference, use `createTypewoo()` instead.
 *
 * @deprecated Use `createTypewoo()` instead to create a single typewoo instance. This will be removed in a future major version.
 *
 * **Migration:**
 * ```typescript
 * // Before (deprecated):
 * await Typewoo.init({ baseUrl: 'https://mystore.com' });
 * const products = await Typewoo.store.products.list();
 *
 * // After (recommended):
 * // Create once at app startup (e.g., in a shared module or context provider)
 * const typewoo = createTypewoo({ baseUrl: 'https://mystore.com' });
 *
 * // Then import and use throughout your app
 * const products = await typewoo.store.products.list();
 * ```
 */
export const Typewoo = new Sdk();

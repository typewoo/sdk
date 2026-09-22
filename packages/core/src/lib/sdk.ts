import axios from 'axios';
import {
  CustomEndpoints,
  resolveConfig,
  ResolvedSdkConfig,
  SdkConfig,
} from './configs/sdk.config.js';
import { SdkState } from './types/sdk.state.js';
import { setDefaultHttpContext } from './http/http.client.js';
import { createHttp, TypewooHttp } from './http/http.js';
import { addCartTokenInterceptors } from './interceptors/cart.token.interceptor.js';
import { addNonceInterceptors } from './interceptors/nonce.interceptor.js';
import { StoreService } from './services/store.service.js';
import { SdkEvent } from './sdk.events.js';
import { EventBus } from './bus/event.bus.js';
import { addTokenInterceptor } from './interceptors/token.interceptor.js';
import { AuthService } from './services/auth/auth.service.js';
import { addRefreshTokenInterceptor } from './interceptors/refresh.token.interceptor.js';
import { AdminService } from './services/admin.service.js';
import { AnalyticsService } from './services/analytics.service.js';
import { addAdminAuthInterceptor } from './interceptors/admin-auth.interceptor.js';

/**
 * Create a fully typed Typewoo SDK instance.
 *
 * Each call returns an independent instance with its own HTTP client,
 * interceptors, configuration and state, so several instances (e.g. one per
 * store, or one per server request) never interfere with each other.
 *
 * @example
 * ```typescript
 * import { createTypewoo, RequestOptions } from '@typewoo/sdk';
 *
 * // Create your typed SDK instance
 * export const typewoo = createTypewoo({
 *   baseUrl: 'https://mystore.com',
 *   endpoints: (http) => ({
 *     posts: (options?: RequestOptions) => http.get(`/wp/v2/posts`, options),
 *     pages: () => http.get(`/wp/v2/pages`),
 *   }),
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
  private readonly _auth: AuthService;
  private readonly _store: StoreService;
  private readonly _admin: AdminService;
  private readonly _analytics: AnalyticsService;
  private readonly _config: ResolvedSdkConfig;
  private readonly _http: TypewooHttp;
  private readonly _endpoints: TEndpoints;

  state: SdkState = {};
  events = new EventBus<SdkEvent>();

  /**
   * Resolves once the initial authentication state has been read from
   * storage (`state.authenticated` is set and `auth:changed` has fired).
   * Await it before reading `state.authenticated` at startup.
   */
  readonly ready: Promise<void>;

  constructor(config: SdkConfig<TEndpoints>) {
    // Resolve all storage providers to ensure type safety
    this._config = resolveConfig(config);

    const client = axios.create({
      baseURL: this._config.baseUrl,
      ...this._config.axiosConfig,
    });
    const context = { client, config: this._config };
    this._http = createHttp(context);

    // Lets the free doGet/doPost helpers work without an explicit instance
    setDefaultHttpContext(context);

    this._auth = new AuthService(
      this.state,
      this._config,
      this.events,
      this._http
    );
    this._store = new StoreService(
      this.state,
      this._config,
      this.events,
      this._http
    );
    this._admin = new AdminService(
      this.state,
      this._config,
      this.events,
      this._http
    );
    this._analytics = new AnalyticsService(
      this.state,
      this._config,
      this.events,
      this._http
    );

    this._endpoints = (
      typeof config.endpoints === 'function'
        ? config.endpoints(this._http)
        : config.endpoints ?? {}
    ) as TEndpoints;

    addNonceInterceptors(client, this._config, this.state, this.events);
    addCartTokenInterceptors(client, this._config, this.state, this.events);

    if (!config.auth?.accessToken?.disabled) {
      const useTokenInterceptor =
        this._config.auth?.accessToken?.useInterceptor ?? true;
      if (useTokenInterceptor) {
        addTokenInterceptor(client, this._config);
      }
    }

    if (
      !config.auth?.accessToken?.disabled &&
      !config.auth?.refreshToken?.disabled
    ) {
      const useRefreshTokenInterceptor =
        this._config.auth?.refreshToken?.useInterceptor ?? true;
      if (useRefreshTokenInterceptor) {
        addRefreshTokenInterceptor(
          client,
          this._config,
          this._auth,
          this.state,
          this.events
        );
      }
    }

    if (
      this._config.admin?.consumer_key &&
      this._config.admin.consumer_secret
    ) {
      if (this._config.admin.useAuthInterceptor !== false) {
        addAdminAuthInterceptor(client, this._config);
      }
    }

    this.ready = this.loadAuthState();
  }

  /**
   * Sets the initial authentication state based on the stored access token.
   * A failing storage provider leaves the instance unauthenticated instead of
   * surfacing an unhandled rejection.
   */
  private async loadAuthState(): Promise<void> {
    const accessTokenStorage = this._config.auth?.accessToken?.storage;
    if (!accessTokenStorage) return;

    let authenticated = false;
    try {
      authenticated = !!(await accessTokenStorage.get());
    } catch {
      authenticated = false;
    }
    this.state.authenticated = authenticated;
    this.events.emit('auth:changed', authenticated);
  }

  /**
   * Sets the unique identifier for the SDK instance.
   * Useful when the identifier needs to be set asynchronously after SDK initialization.
   */
  setUniqueIdentifier(identifier: string): void {
    this._config.uniqueIdentifier = identifier;
  }

  /**
   * Resolved SDK configuration.
   * Storage fields are guaranteed to be StorageProvider instances after initialization.
   */
  get config(): ResolvedSdkConfig {
    return this._config;
  }

  /**
   * HTTP helpers bound to this instance, for requests the built-in services
   * don't cover. `http.client` is the instance's axios client, e.g. for
   * adding your own interceptors.
   */
  get http(): TypewooHttp {
    return this._http;
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
   * Analytics API (WooCommerce Analytics)
   */
  get analytics() {
    return this._analytics;
  }

  /**
   * Custom endpoints defined in the SDK configuration.
   *
   * @example
   * ```typescript
   * const typewoo = createTypewoo({
   *   baseUrl: 'https://mystore.com',
   *   endpoints: (http) => ({
   *     getNotifications: (userId: string) =>
   *       http.get<Notification[]>(`/notifications/${userId}`),
   *   }),
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

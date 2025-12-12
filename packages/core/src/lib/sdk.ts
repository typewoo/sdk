import {
  resolveConfig,
  ResolvedSdkConfig,
  SdkConfig,
} from './configs/sdk.config.js';
import { SdkState } from './types/sdk.state.js';
import { createHttpClient } from './services/api.js';
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

export const Typewoo = new Sdk();

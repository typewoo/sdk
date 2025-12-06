import { resolveStorageProvider, SdkConfig } from './configs/sdk.config.js';
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
import { StorageProvider } from './utilities/storage.providers.js';

export class Sdk {
  private _config!: SdkConfig;
  state: SdkState = {};

  private _auth!: AuthService;
  private _store!: StoreService;
  private _admin!: AdminService;

  private _initialized = false;

  events = new EventBus<SdkEvent>();

  public async init(config: SdkConfig): Promise<void> {
    if (this._initialized) return;

    this._config = config;

    // Resolve storage providers
    if (!config.auth?.accessToken?.disabled) {
      const accessTokenStorage = resolveStorageProvider(
        config.auth?.accessToken?.storage,
        config.auth?.accessToken?.key ?? 'typewoo_access_token'
      );
      config.auth = {
        ...config.auth,
        accessToken: {
          ...config.auth?.accessToken,
          storage: accessTokenStorage,
        },
      };
    }

    if (
      !config.auth?.accessToken?.disabled &&
      !config.auth?.refreshToken?.disabled
    ) {
      const refreshTokenStorage = resolveStorageProvider(
        config.auth?.refreshToken?.storage,
        config.auth?.refreshToken?.key ?? 'typewoo_refresh_token'
      );
      config.auth = {
        ...config.auth,
        refreshToken: {
          ...config.auth?.refreshToken,
          storage: refreshTokenStorage,
        },
      };
    }

    if (!config.cartToken?.disabled) {
      const cartTokenStorage = resolveStorageProvider(
        config.cartToken?.storage,
        config.cartToken?.key ?? 'typewoo_cart_token'
      );
      config.cartToken = { ...config.cartToken, storage: cartTokenStorage };
    }

    if (!config.nonce?.disabled) {
      const nonceStorage = resolveStorageProvider(
        config.nonce?.storage,
        config.nonce?.key ?? 'typewoo_nonce'
      );
      config.nonce = { ...config.nonce, storage: nonceStorage };
    }

    this._auth = new AuthService(this.state, this._config, this.events);
    this._store = new StoreService(this.state, this._config, this.events);
    this._admin = new AdminService(this.state, this._config, this.events);

    createHttpClient({
      baseURL: config.baseUrl,
    });

    addNonceInterceptors(config, this.state, this.events);
    addCartTokenInterceptors(config, this.state, this.events);

    if (!config.auth?.accessToken?.disabled) {
      const useTokenInterceptor =
        config.auth?.accessToken?.useInterceptor ?? true;
      if (useTokenInterceptor) {
        addTokenInterceptor(config);
      }
    }

    if (
      !config.auth?.accessToken?.disabled &&
      !config.auth?.refreshToken?.disabled
    ) {
      const useRefreshTokenInterceptor =
        config.auth?.refreshToken?.useInterceptor ?? true;
      if (useRefreshTokenInterceptor) {
        addRefreshTokenInterceptor(config, this._auth);
      }
    }

    if (config.admin?.consumer_key && config.admin.consumer_secret) {
      if (config.admin.useAuthInterceptor !== false) {
        addAdminAuthInterceptor(config);
      }
    }

    // Set initial authentication state based on stored token
    const accessTokenStorage = config.auth?.accessToken?.storage as
      | StorageProvider
      | undefined;
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

import { AxiosRequestConfig } from 'axios';
import { doGet, doPost } from '../../utilities/axios.utility.js';
import { BaseService } from '../base.service.js';
import * as qs from 'qs';
import { ApiResult } from '../../types/api.js';
import {
  AuthTokenRequest,
  AuthTokenResponse,
  AuthRefreshRequest,
  AuthRevokeRequest,
  AuthRevokeResponse,
  AuthOneTimeTokenRequest,
  AuthOneTimeTokenResponse,
  AuthValidateResponse,
  AuthStatusResponse,
} from '../../types/index.js';

export class AuthService extends BaseService {
  private readonly endpoint = 'wp-json/typewoo/v1/auth';

  async getAutoLoginUrl(
    ott: string,
    redirect: string,
    trackingParams?: Record<string, string | number | boolean>
  ) {
    const params = qs.stringify({
      token: ott,
      redirect: redirect,
      ...(trackingParams ?? {}),
    });

    const url = `${this.config.baseUrl}/${this.endpoint}/autologin`;
    return `${url}?${params}`;
  }

  async token(
    body: AuthTokenRequest,
    options?: AxiosRequestConfig
  ): Promise<ApiResult<AuthTokenResponse>> {
    const url = `/${this.endpoint}/token`;
    if (this.config.auth?.revokeTokenBeforeLogin) {
      await this.revokeToken();
    }

    this.events.emit('auth:login:start');

    const { data, error } = await doPost<AuthTokenResponse, AuthTokenRequest>(
      url,
      body,
      options
    );

    this.events.emitIf(!!data, 'auth:login:success');
    this.events.emitIf(!!error, 'auth:login:error', error);

    if (!error && data) {
      const accessTokenStorage = this.config.auth?.accessToken?.storage;
      const refreshTokenStorage = this.config.auth?.refreshToken?.storage;

      if (accessTokenStorage) {
        this.state.authenticated = true;
        this.events.emit('auth:changed', true);
        await accessTokenStorage.set(data.token);
      }
      if (refreshTokenStorage && data.refresh_token) {
        await refreshTokenStorage.set(data.refresh_token);
      }
    }

    return { data: data, error };
  }

  async refreshToken(
    body: AuthRefreshRequest,
    options?: AxiosRequestConfig
  ): Promise<ApiResult<AuthTokenResponse>> {
    const url = `/${this.endpoint}/refresh`;

    this.events.emit('auth:token:refresh:start');

    const { data, error } = await doPost<AuthTokenResponse, AuthRefreshRequest>(
      url,
      body,
      options
    );

    this.events.emitIf(!!data, 'auth:token:refresh:success');
    this.events.emitIf(!!error, 'auth:token:refresh:error', error);

    if (!error && data) {
      const accessTokenStorage = this.config.auth?.accessToken?.storage;
      const refreshTokenStorage = this.config.auth?.refreshToken?.storage;

      if (accessTokenStorage) {
        await accessTokenStorage.set(data.token);
      }

      if (refreshTokenStorage && data.refresh_token) {
        await refreshTokenStorage.set(data.refresh_token);
      }
    }

    return { data: data, error };
  }

  async revokeToken(
    body?: AuthRevokeRequest,
    options?: AxiosRequestConfig
  ): Promise<ApiResult<AuthRevokeResponse>> {
    const url = `/${this.endpoint}/revoke`;

    this.events.emit('auth:token:revoke:start');

    const { data, error } = await doPost<AuthRevokeResponse, AuthRevokeRequest>(
      url,
      body,
      options
    );

    this.events.emitIf(!!data, 'auth:token:revoke:success');
    this.events.emitIf(!!error, 'auth:token:revoke:error', error);

    if (!error) {
      const accessTokenStorage = this.config.auth?.accessToken?.storage;
      const refreshTokenStorage = this.config.auth?.refreshToken?.storage;

      if (accessTokenStorage) {
        await accessTokenStorage.clear();
      }
      if (refreshTokenStorage) {
        await refreshTokenStorage.clear();
      }

      this.state.authenticated = false;
      this.events.emit('auth:changed', false);
    }

    return { data: data, error };
  }

  async oneTimeToken(
    body: AuthOneTimeTokenRequest,
    options?: AxiosRequestConfig
  ): Promise<ApiResult<AuthOneTimeTokenResponse>> {
    const url = `/${this.endpoint}/one-time-token`;

    const { data, error } = await doPost<
      AuthOneTimeTokenResponse,
      AuthOneTimeTokenRequest
    >(url, body, options);

    return { data: data, error };
  }

  async validate(
    options?: AxiosRequestConfig
  ): Promise<ApiResult<AuthValidateResponse>> {
    const url = `/${this.endpoint}/validate`;

    const { data, error } = await doGet<AuthValidateResponse>(url, options);

    return { data: data, error };
  }

  async status(
    options?: AxiosRequestConfig
  ): Promise<ApiResult<AuthStatusResponse>> {
    const url = `/${this.endpoint}/status`;

    const { data, error } = await doGet<AuthStatusResponse>(url, options);

    return { data: data, error };
  }
}

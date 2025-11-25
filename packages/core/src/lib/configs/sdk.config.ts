export interface SdkConfig {
  baseUrl: string;
  /**
   * API key for authenticating requests to the backend API (e.g., NestJS proxy).
   * When provided, the SDK will automatically include this key in the `x-api-key` header.
   * This is optional and only needed when your backend requires API key authentication.
   */
  apiKey?: string;
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
    useTokenInterceptor?: boolean;
    useRefreshTokenInterceptor?: boolean;
    getToken?: () => Promise<string>;
    setToken?: (token: string) => Promise<void>;
    getRefreshToken?: () => Promise<string>;
    setRefreshToken?: (refreshToken: string) => Promise<void>;
    clearToken?: () => Promise<void>;
  };
  nonce?: {
    disabled?: boolean;
    getToken?: () => Promise<string>;
    setToken?: (nonce: string) => Promise<void>;
    clearToken?: () => Promise<void>;
  };
  cartToken?: {
    disabled?: boolean;
    getToken?: () => Promise<string>;
    setToken?: (cartToken: string) => Promise<void>;
    clearToken?: () => Promise<void>;
  };
}

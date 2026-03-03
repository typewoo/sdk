import { describe, it, expect, vi } from 'vitest';
import { createTypewoo } from '../../../sdk.js';

// Mock the HTTP client and interceptors to isolate SDK tests
vi.mock('../../../http/http.client.js', () => ({
  createHttpClient: vi.fn(),
  httpClient: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock('../../../interceptors/cart.token.interceptor.js', () => ({
  addCartTokenInterceptors: vi.fn(),
}));

vi.mock('../../../interceptors/nonce.interceptor.js', () => ({
  addNonceInterceptors: vi.fn(),
}));

vi.mock('../../../interceptors/token.interceptor.js', () => ({
  addTokenInterceptor: vi.fn(),
}));

vi.mock('../../../interceptors/refresh.token.interceptor.js', () => ({
  addRefreshTokenInterceptor: vi.fn(),
}));

vi.mock('../../../interceptors/admin-auth.interceptor.js', () => ({
  addAdminAuthInterceptor: vi.fn(),
}));

describe('AuthService.getAutoLoginUrl', () => {
  const endpoint = 'wp-json/typewoo/v1/auth/autologin';

  describe('when config.auth.autoLoginUrl is provided', () => {
    it('should use autoLoginUrl as the base instead of baseUrl', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
        auth: {
          autoLoginUrl: 'https://login.example.com',
        },
      });

      const url = await sdk.auth.getAutoLoginUrl('my-ott-token', '/dashboard');

      expect(url).toContain('https://login.example.com');
      expect(url).not.toContain('https://store.example.com');
      expect(url).toContain(endpoint);
    });

    it('should include token and redirect query params with autoLoginUrl', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
        auth: {
          autoLoginUrl: 'https://login.example.com',
        },
      });

      const url = await sdk.auth.getAutoLoginUrl('abc123', '/my-account');

      expect(url).toBe(
        `https://login.example.com/${endpoint}?token=abc123&redirect=%2Fmy-account`
      );
    });

    it('should include tracking params when autoLoginUrl is set', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
        auth: {
          autoLoginUrl: 'https://login.example.com',
        },
      });

      const url = await sdk.auth.getAutoLoginUrl('tok', '/shop', {
        utm_source: 'email',
        campaign_id: 42,
        active: true,
      });

      expect(url).toContain('https://login.example.com');
      expect(url).toContain('token=tok');
      expect(url).toContain('redirect=%2Fshop');
      expect(url).toContain('utm_source=email');
      expect(url).toContain('campaign_id=42');
      expect(url).toContain('active=true');
    });
  });

  describe('when config.auth.autoLoginUrl is NOT provided', () => {
    it('should fall back to config.baseUrl', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
      });

      const url = await sdk.auth.getAutoLoginUrl('my-ott-token', '/dashboard');

      expect(url).toContain('https://store.example.com');
      expect(url).toContain(endpoint);
    });

    it('should include token and redirect query params with baseUrl fallback', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
      });

      const url = await sdk.auth.getAutoLoginUrl('abc123', '/my-account');

      expect(url).toBe(
        `https://store.example.com/${endpoint}?token=abc123&redirect=%2Fmy-account`
      );
    });

    it('should include tracking params with baseUrl fallback', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
      });

      const url = await sdk.auth.getAutoLoginUrl('tok', '/shop', {
        utm_source: 'newsletter',
        ref: 99,
      });

      expect(url).toContain('https://store.example.com');
      expect(url).toContain('token=tok');
      expect(url).toContain('redirect=%2Fshop');
      expect(url).toContain('utm_source=newsletter');
      expect(url).toContain('ref=99');
    });
  });

  describe('when config.auth exists but autoLoginUrl is undefined', () => {
    it('should fall back to config.baseUrl', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
        auth: {
          autoLoginUrl: undefined,
        },
      });

      const url = await sdk.auth.getAutoLoginUrl('tok', '/home');

      expect(url).toContain('https://store.example.com');
      expect(url).not.toContain('undefined');
      expect(url).toContain(endpoint);
    });
  });

  describe('URL structure', () => {
    it('should produce a well-formed URL with autoLoginUrl', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
        auth: {
          autoLoginUrl: 'https://auth.example.com',
        },
      });

      const url = await sdk.auth.getAutoLoginUrl('t1', '/checkout');

      // Verify structure: <base>/<endpoint>?<params>
      const [baseAndPath, queryString] = url.split('?');
      expect(baseAndPath).toBe(`https://auth.example.com/${endpoint}`);
      expect(queryString).toContain('token=t1');
      expect(queryString).toContain('redirect=%2Fcheckout');
    });

    it('should produce a well-formed URL with baseUrl fallback', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://store.example.com',
      });

      const url = await sdk.auth.getAutoLoginUrl('t2', '/cart');

      const [baseAndPath, queryString] = url.split('?');
      expect(baseAndPath).toBe(`https://store.example.com/${endpoint}`);
      expect(queryString).toContain('token=t2');
      expect(queryString).toContain('redirect=%2Fcart');
    });
  });
});

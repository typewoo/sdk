import { describe, it, expect, vi } from 'vitest';
import { createTypewoo } from '../../../sdk.js';
import { AnalyticsService } from '../../../services/analytics.service.js';

// Mock the HTTP client and interceptors to isolate SDK init tests
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

describe('SDK analytics integration', () => {
  it('createTypewoo exposes analytics service', () => {
    const sdk = createTypewoo({
      baseUrl: 'https://example.com',
    });

    expect(sdk.analytics).toBeDefined();
    expect(sdk.analytics).toBeInstanceOf(AnalyticsService);
  });

  it('analytics sub-services are accessible via sdk.analytics.*', () => {
    const sdk = createTypewoo({
      baseUrl: 'https://example.com',
    });

    expect(sdk.analytics.revenue).toBeDefined();
    expect(sdk.analytics.orders).toBeDefined();
    expect(sdk.analytics.products).toBeDefined();
    expect(sdk.analytics.categories).toBeDefined();
    expect(sdk.analytics.coupons).toBeDefined();
    expect(sdk.analytics.taxes).toBeDefined();
    expect(sdk.analytics.variations).toBeDefined();
    expect(sdk.analytics.customers).toBeDefined();
    expect(sdk.analytics.downloads).toBeDefined();
    expect(sdk.analytics.stock).toBeDefined();
    expect(sdk.analytics.performance).toBeDefined();
    expect(sdk.analytics.leaderboards).toBeDefined();
  });
});

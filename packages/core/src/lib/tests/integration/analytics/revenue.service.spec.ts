import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AnalyticsRevenueStatsResponseSchema } from '../../../types/analytics/revenue/index.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;

beforeAll(() => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });
});

describe('Analytics Revenue — integration', () => {
  it('returns revenue stats with valid shape', async () => {
    const { data, error } = await sdk.analytics.revenue.getStats({
      after: '2025-01-01T00:00:00',
      before: '2026-12-31T23:59:59',
      interval: 'month',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AnalyticsRevenueStatsResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('returns error with exact code for invalid params', async () => {
    const { data, error } = await sdk.analytics.revenue.getStats({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      interval: 'invalid_interval' as any,
    });

    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect([
      'invalid_param',
      'rest_invalid_param',
      'woocommerce_analytics_invalid_query',
    ]).toContain(error?.code);
  });
});

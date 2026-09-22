import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import {
  AnalyticsPerformanceIndicatorSchema,
  AnalyticsPerformanceAllowedSchema,
} from '../../../types/analytics/performance/index.js';
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

describe('Analytics Performance — integration', () => {
  it('returns performance indicators with valid shape', async () => {
    const { data, error } = await sdk.analytics.performance.getIndicators({
      after: '2025-01-01T00:00:00',
      before: '2026-12-31T23:59:59',
      stats: ['revenue/net_revenue', 'orders/orders_count'],
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = AnalyticsPerformanceIndicatorSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('returns allowed performance indicators with valid shape', async () => {
    const { data, error } = await sdk.analytics.performance.getAllowed();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = AnalyticsPerformanceAllowedSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });
});

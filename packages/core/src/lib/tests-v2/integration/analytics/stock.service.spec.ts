import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import {
  AnalyticsStockItemSchema,
  AnalyticsStockStatsResponseSchema,
} from '../../../types/analytics/stock/index.js';
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

describe('Analytics Stock — integration', () => {
  it('returns stock stats with valid shape', async () => {
    const { data, error } = await sdk.analytics.stock.getStats();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AnalyticsStockStatsResponseSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('returns a list of stock items with valid shape', async () => {
    const result = await sdk.analytics.stock.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AnalyticsStockItemSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('returns pagination metadata in list response', async () => {
    const result = await sdk.analytics.stock.list({ per_page: 2 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(result.pagination.total).toBeTypeOf('number');
    expect(result.pagination.totalPages).toBeTypeOf('number');
  });
});

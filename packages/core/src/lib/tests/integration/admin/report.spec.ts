import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminReportSchema } from '../../../types/admin/reports/report.schema.js';
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

describe('Admin Report — integration', () => {
  it('lists reports and validates schema per item', async () => {
    const result = await sdk.admin.reports.list();

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data?.length ?? 0) > 0).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminReportSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets orders totals report', async () => {
    const { data, error } = await sdk.admin.reports.getOrdersTotals();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
    expect((data?.length ?? 0) > 0).toBe(true);
  });

  it('gets products totals report', async () => {
    const { data, error } = await sdk.admin.reports.getProductsTotals();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('gets customers totals report', async () => {
    const { data, error } = await sdk.admin.reports.getCustomersTotals();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);
  });
});

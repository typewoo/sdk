import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminShippingMethodSchema } from '../../../types/admin/shipping-methods/shipping-method.schema.js';
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

describe('Admin Shipping Method — integration', () => {
  it('lists global shipping methods and validates schema per item', async () => {
    const result = await sdk.admin.shippingMethods.list();

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data?.length ?? 0) > 0).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminShippingMethodSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a specific shipping method (flat_rate) and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingMethods.get('flat_rate');

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminShippingMethodSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe('flat_rate');
  });
});

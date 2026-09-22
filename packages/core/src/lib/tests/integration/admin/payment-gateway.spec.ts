import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminPaymentGatewaySchema } from '../../../types/admin/payment-gateways/payment-gateway.schema.js';
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

describe('Admin Payment Gateway — integration', () => {
  it('lists payment gateways and validates schema per item', async () => {
    const result = await sdk.admin.paymentGateways.list();

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data?.length ?? 0) > 0).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminPaymentGatewaySchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a specific payment gateway (bacs) and validates schema', async () => {
    const { data, error } = await sdk.admin.paymentGateways.get('bacs');

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminPaymentGatewaySchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe('bacs');
  });
});

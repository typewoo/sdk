import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminCustomerSchema } from '../../../types/admin/customers/customer.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdCustomerId = 0;

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

afterAll(async () => {
  if (createdCustomerId) {
    await sdk.admin.customers.delete(createdCustomerId, true);
  }
});

describe('Admin Customer — integration', () => {
  it('creates a customer and validates schema', async () => {
    const { data, error } = await sdk.admin.customers.create({
      email: `test-${Date.now()}@example.com`,
      first_name: 'Test',
      last_name: 'Customer',
      username: `test_customer_${Date.now()}`,
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdCustomerId = data!.id;

    const parsed = AdminCustomerSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists customers and validates schema per item with pagination', async () => {
    const result = await sdk.admin.customers.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminCustomerSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }

    expect(result.pagination.total).toBeTypeOf('number');
    expect(result.pagination.totalPages).toBeTypeOf('number');
  });

  it('gets customer by id and validates schema', async () => {
    const { data, error } = await sdk.admin.customers.get(createdCustomerId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCustomerSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdCustomerId);
  });

  it('updates customer name and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.customers.update(
      createdCustomerId,
      { first_name: 'Updated' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCustomerSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.first_name).toBe('Updated');
  });

  it('returns error for invalid customer id', async () => {
    const { data, error } = await sdk.admin.customers.get(999999999);

    expect(data).toBeUndefined();
    expect(error?.code).toBe('wc_user_invalid_id');
  });

  it('deletes the created customer successfully', async () => {
    const { data, error } = await sdk.admin.customers.delete(
      createdCustomerId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminCustomerSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdCustomerId = 0;
  });
});

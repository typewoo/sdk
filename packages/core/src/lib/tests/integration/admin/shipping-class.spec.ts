import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminShippingClassSchema } from '../../../types/admin/shipping-classes/shipping-class.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdClassId = 0;

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
  if (createdClassId) {
    await sdk.admin.shippingClasses.delete(createdClassId, true);
  }
});

describe('Admin Shipping Class — integration', () => {
  it('creates a shipping class and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingClasses.create({
      name: 'Integration Test Class',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdClassId = data!.id;

    const parsed = AdminShippingClassSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists shipping classes and validates schema per item', async () => {
    const result = await sdk.admin.shippingClasses.list({ per_page: 10 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminShippingClassSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a shipping class by id and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingClasses.get(createdClassId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminShippingClassSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdClassId);
  });

  it('updates a shipping class name', async () => {
    const { data, error } = await sdk.admin.shippingClasses.update(
      createdClassId,
      { name: 'Updated Test Class' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminShippingClassSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Updated Test Class');
  });

  it('deletes the shipping class successfully', async () => {
    const { error } = await sdk.admin.shippingClasses.delete(
      createdClassId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdClassId = 0;
  });
});

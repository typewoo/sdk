import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminShippingZoneSchema } from '../../../types/admin/shipping-zones/shipping-zone.schema.js';
import { AdminShippingZoneLocationSchema } from '../../../types/admin/shipping-zones/shipping-zone-location.schema.js';
import { AdminShippingZoneMethodSchema } from '../../../types/admin/shipping-zones/shipping-zone-method.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdZoneId = 0;
let createdMethodInstanceId = 0;

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
  if (createdZoneId) {
    await sdk.admin.shippingZones.delete(createdZoneId, true);
  }
});

describe('Admin Shipping Zone — integration', () => {
  it('creates a shipping zone and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingZones.create({
      name: 'Integration Test Zone',
      order: 99,
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdZoneId = data!.id;

    const parsed = AdminShippingZoneSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists shipping zones and validates schema per item', async () => {
    const result = await sdk.admin.shippingZones.list();

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminShippingZoneSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a shipping zone by id and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingZones.get(createdZoneId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminShippingZoneSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdZoneId);
  });

  it('updates zone name and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingZones.update(
      createdZoneId,
      { name: 'Updated Integration Zone' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminShippingZoneSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Updated Integration Zone');
  });

  it('lists zone locations and validates schema per item', async () => {
    const { data, error } = await sdk.admin.shippingZones.listLocations(
      createdZoneId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminShippingZoneLocationSchema.safeParse(item);
      expect(
        parsed.success,
        `location safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('adds a flat_rate method to the zone and validates schema', async () => {
    const { data, error } = await sdk.admin.shippingZones.addMethod(
      createdZoneId,
      'flat_rate'
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdMethodInstanceId = data!.instance_id;

    const parsed = AdminShippingZoneMethodSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.method_id).toBe('flat_rate');
  });

  it('lists zone methods and validates schema per item', async () => {
    const { data, error } = await sdk.admin.shippingZones.listMethods(
      createdZoneId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(Array.isArray(data)).toBe(true);

    for (const item of data ?? []) {
      const parsed = AdminShippingZoneMethodSchema.safeParse(item);
      expect(
        parsed.success,
        `method safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('deletes the zone successfully', async () => {
    const { error } = await sdk.admin.shippingZones.delete(createdZoneId, true);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdZoneId = 0;
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminProductAttributeSchema } from '../../../types/admin/attributes/attribute.schema.js';
import { AdminProductAttributeTermSchema } from '../../../types/admin/attributes/attribute-term.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdAttributeId = 0;
let createdTermId = 0;

beforeAll(async () => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });

  const { data } = await sdk.admin.productAttributes.create({
    name: 'Test Attribute (integration)',
    slug: `test-attr-${Date.now()}`,
  });
  createdAttributeId = data!.id;
});

afterAll(async () => {
  if (createdAttributeId) {
    await sdk.admin.productAttributes.delete(createdAttributeId, true);
  }
});

describe('Admin Product Attribute — integration', () => {
  it('lists attributes and validates schema per item', async () => {
    const result = await sdk.admin.productAttributes.list();

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminProductAttributeSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets attribute by id and validates schema', async () => {
    const { data, error } = await sdk.admin.productAttributes.get(
      createdAttributeId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductAttributeSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdAttributeId);
  });

  it('updates attribute name and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.productAttributes.update(
      createdAttributeId,
      { name: 'Test Attribute (updated)' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductAttributeSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Test Attribute (updated)');
  });

  it('creates an attribute term and validates schema', async () => {
    const { data, error } = await sdk.admin.attributeTerms.create(
      createdAttributeId,
      { name: 'Test Term (integration)' }
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdTermId = data!.id;

    const parsed = AdminProductAttributeTermSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('gets attribute term by id and validates schema', async () => {
    const { data, error } = await sdk.admin.attributeTerms.get(
      createdAttributeId,
      createdTermId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductAttributeTermSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdTermId);
  });

  it('deletes the attribute term successfully', async () => {
    const { data, error } = await sdk.admin.attributeTerms.delete(
      createdAttributeId,
      createdTermId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminProductAttributeTermSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdTermId = 0;
  });
});

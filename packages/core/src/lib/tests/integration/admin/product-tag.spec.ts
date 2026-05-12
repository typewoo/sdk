import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminTaxonomyTagSchema } from '../../../types/admin/product-tags/product-tag.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdTagId = 0;

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
  if (createdTagId) {
    await sdk.admin.productTags.delete(createdTagId, true);
  }
});

describe('Admin Product Tag — integration', () => {
  it('creates a tag and validates schema', async () => {
    const { data, error } = await sdk.admin.productTags.create({
      name: 'Test Tag (integration)',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdTagId = data!.id;

    const parsed = AdminTaxonomyTagSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists tags and validates schema per item', async () => {
    const result = await sdk.admin.productTags.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminTaxonomyTagSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets tag by id and validates schema', async () => {
    const { data, error } = await sdk.admin.productTags.get(createdTagId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxonomyTagSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdTagId);
  });

  it('updates tag name and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.productTags.update(createdTagId, {
      name: 'Test Tag (updated)',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxonomyTagSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Test Tag (updated)');
  });

  it('deletes the created tag successfully', async () => {
    const { data, error } = await sdk.admin.productTags.delete(
      createdTagId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminTaxonomyTagSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdTagId = 0;
  });
});

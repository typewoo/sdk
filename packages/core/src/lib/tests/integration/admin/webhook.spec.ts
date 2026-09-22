import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminWebhookSchema } from '../../../types/admin/webhooks/webhook.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdWebhookId = 0;

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
  if (createdWebhookId) {
    await sdk.admin.webhooks.delete(createdWebhookId, true);
  }
});

describe('Admin Webhook — integration', () => {
  it('creates a webhook and validates schema', async () => {
    const { data, error } = await sdk.admin.webhooks.create({
      name: 'Integration Test Webhook',
      topic: 'order.created',
      delivery_url: 'https://example.com/wc-webhook',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdWebhookId = data!.id;

    const parsed = AdminWebhookSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('lists webhooks and validates schema per item', async () => {
    const result = await sdk.admin.webhooks.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminWebhookSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }
  });

  it('gets a webhook by id and validates schema', async () => {
    const { data, error } = await sdk.admin.webhooks.get(createdWebhookId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminWebhookSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdWebhookId);
  });

  it('updates webhook name and validates schema', async () => {
    const { data, error } = await sdk.admin.webhooks.update(createdWebhookId, {
      name: 'Updated Integration Webhook',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminWebhookSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.name).toBe('Updated Integration Webhook');
  });

  it('deletes the webhook successfully', async () => {
    const { error } = await sdk.admin.webhooks.delete(createdWebhookId, true);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdWebhookId = 0;
  });
});

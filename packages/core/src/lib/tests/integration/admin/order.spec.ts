import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminOrderSchema } from '../../../types/admin/orders/order.schema.js';
import { AdminOrderNoteSchema } from '../../../types/admin/orders/order-note.schema.js';
import { AdminRefundSchema } from '../../../types/admin/refunds/refund.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;
let createdOrderId = 0;
let createdNoteId = 0;
let createdRefundId = 0;

beforeAll(async () => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });

  const { data } = await sdk.admin.orders.create({
    status: 'pending',
    billing: {
      first_name: 'Test',
      last_name: 'Customer',
      email: 'test@example.com',
    },
  });
  createdOrderId = data!.id;
});

afterAll(async () => {
  if (createdOrderId) {
    await sdk.admin.orders.delete(createdOrderId, true);
  }
});

describe('Admin Order — integration', () => {
  it('lists orders and validates schema per item with pagination', async () => {
    const result = await sdk.admin.orders.list({ per_page: 5 });

    expect(
      result.error,
      `unexpected error: ${result.error?.code}`
    ).toBeUndefined();
    expect(Array.isArray(result.data)).toBe(true);

    for (const item of result.data ?? []) {
      const parsed = AdminOrderSchema.safeParse(item);
      expect(
        parsed.success,
        `item safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
      ).toBe(true);
    }

    expect(result.pagination.total).toBeTypeOf('number');
    expect(result.pagination.totalPages).toBeTypeOf('number');
  });

  it('gets order by id and validates schema', async () => {
    const { data, error } = await sdk.admin.orders.get(createdOrderId);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminOrderSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdOrderId);
  });

  it('updates order status and reflects the changed field', async () => {
    const { data, error } = await sdk.admin.orders.update(createdOrderId, {
      status: 'on-hold',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminOrderSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.status).toBe('on-hold');
  });

  it('creates an order note and validates schema', async () => {
    const { data, error } = await sdk.admin.orders.createNote(createdOrderId, {
      note: 'Integration test note',
    });

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdNoteId = data!.id;

    const parsed = AdminOrderNoteSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('gets the created order note and validates schema', async () => {
    const { data, error } = await sdk.admin.orders.getNote(
      createdOrderId,
      createdNoteId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminOrderNoteSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    expect(data?.id).toBe(createdNoteId);
  });

  it('deletes the order note successfully', async () => {
    const { data, error } = await sdk.admin.orders.deleteNote(
      createdOrderId,
      createdNoteId,
      true
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminOrderNoteSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdNoteId = 0;
  });

  it('creates an order refund and validates schema', async () => {
    const { data, error } = await sdk.admin.orders.createRefund(
      createdOrderId,
      { amount: '0', reason: 'Integration test refund', api_refund: false }
    );

    if (error?.code === 'woocommerce_rest_shop_order_invalid_status') {
      // Some WC versions don't allow refunds on on-hold orders — skip
      return;
    }

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    createdRefundId = data!.id;

    const parsed = AdminRefundSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('gets the created refund and validates schema', async () => {
    if (!createdRefundId) return;

    const { data, error } = await sdk.admin.orders.getRefund(
      createdOrderId,
      createdRefundId
    );

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminRefundSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);
  });

  it('returns error for invalid order id', async () => {
    const { data, error } = await sdk.admin.orders.get(999999999);

    expect(data).toBeUndefined();
    expect(error?.code).toBe('woocommerce_rest_shop_order_invalid_id');
  });

  it('deletes the created order successfully', async () => {
    const { data, error } = await sdk.admin.orders.delete(createdOrderId, true);

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();

    const parsed = AdminOrderSchema.safeParse(data);
    expect(
      parsed.success,
      `safeParse failed: ${JSON.stringify(parsed.error?.issues)}`
    ).toBe(true);

    createdOrderId = 0;
  });
});

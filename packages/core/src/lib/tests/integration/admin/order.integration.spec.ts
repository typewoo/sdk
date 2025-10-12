import { describe, it, expect, beforeAll } from 'vitest';
import { StoreSdk } from '../../../../index.js';
import type {
  AdminOrderRequest,
  AdminOrderEmailTemplateId,
} from '../../../types/admin/order.types.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration tests for Admin Order Service
 * Mirrors the admin coupon/customer integration test patterns.
 */
describe('Integration: Admin Order Service', () => {
  beforeAll(async () => {
    await StoreSdk.init({
      baseUrl: GET_WP_URL(),
      admin: {
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists orders with pagination', async () => {
    const { data, error, total, totalPages } = await StoreSdk.admin.orders.list(
      {
        per_page: 5,
        page: 1,
      }
    );

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);

    if (total) expect(Number(total)).toBeGreaterThanOrEqual(0);
    if (totalPages) expect(Number(totalPages)).toBeGreaterThanOrEqual(0);
  });

  it('creates, retrieves, updates, and deletes an order', async () => {
    // Get an existing product to add as a line item
    const prodList = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(prodList.error).toBeFalsy();
    expect(prodList.data && prodList.data.length > 0).toBe(true);

    if (!prodList.data || prodList.data.length === 0) {
      throw new Error('No products available to create an order');
    }

    const productId = prodList.data[0].id;

    const orderData: AdminOrderRequest = {
      status: 'pending',
      line_items: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      billing: {
        first_name: 'Test',
        last_name: 'Buyer',
        company: '',
        address_1: '123 Test St',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
        email: `order-${Date.now()}@example.com`,
        phone: '555-555-5555',
      },
      shipping: {
        first_name: 'Test',
        last_name: 'Buyer',
        company: '',
        address_1: '123 Test St',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
      },
    };

    // Create order
    const createResult = await StoreSdk.admin.orders.create(orderData);
    expect(createResult.error).toBeFalsy();
    expect(createResult.data).toBeTruthy();

    if (!createResult.data) throw new Error('Failed to create test order');

    const orderId = createResult.data.id;

    // Retrieve the created order
    const getResult = await StoreSdk.admin.orders.get(orderId);
    expect(getResult.error).toBeFalsy();
    expect(getResult.data).toBeTruthy();
    expect(getResult.data?.id).toBe(orderId);

    // Update the order status and note
    const updateData: AdminOrderRequest = {
      status: 'processing',
      customer_note: 'Updated via integration test',
    };

    const updateResult = await StoreSdk.admin.orders.update(
      orderId,
      updateData
    );
    expect(updateResult.error).toBeFalsy();
    expect(updateResult.data).toBeTruthy();
    expect(updateResult.data?.status).toBe('processing');
    expect(updateResult.data?.customer_note).toBe(updateData.customer_note);

    // Delete the order (force delete)
    const deleteResult = await StoreSdk.admin.orders.delete(orderId, true);
    expect(deleteResult.error).toBeFalsy();
    expect(deleteResult.data).toBeTruthy();

    // Verify order is deleted
    const getDeletedResult = await StoreSdk.admin.orders.get(orderId);
    expect(getDeletedResult.error).toBeTruthy();
    expect(getDeletedResult.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch operations', async () => {
    // Get an existing product to add as a line item
    const prodList = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(prodList.error).toBeFalsy();
    expect(prodList.data && prodList.data.length > 0).toBe(true);

    if (!prodList.data || prodList.data.length === 0) return; // Skip gracefully

    const productId = prodList.data[0].id;
    const ts = Date.now();

    const batchData = {
      create: [
        {
          status: 'pending' as const,
          customer_note: `Batch one ${ts}`,
          line_items: [
            {
              product_id: productId,
              quantity: 1,
            },
          ],
        },
        {
          status: 'pending' as const,
          customer_note: `Batch two ${ts}`,
          line_items: [
            {
              product_id: productId,
              quantity: 2,
            },
          ],
        },
      ] as AdminOrderRequest[],
    };

    const batchResult = await StoreSdk.admin.orders.batch(batchData);
    expect(batchResult.error).toBeFalsy();
    expect(batchResult.data).toBeTruthy();

    if (batchResult.data) {
      expect(Array.isArray(batchResult.data.create)).toBe(true);
      expect(batchResult.data.create).toHaveLength(2);

      const created1 = batchResult.data.create[0];
      const created2 = batchResult.data.create[1];

      expect(created1.customer_note).toBe(batchData.create[0].customer_note);
      expect(created2.customer_note).toBe(batchData.create[1].customer_note);

      // Clean up
      await Promise.all([
        StoreSdk.admin.orders.delete(created1.id, true),
        StoreSdk.admin.orders.delete(created2.id, true),
      ]);
    }
  });

  it('handles error cases gracefully', async () => {
    // Non-existent order
    const nonExistentResult = await StoreSdk.admin.orders.get(999999);
    expect(nonExistentResult.error).toBeTruthy();
    expect(nonExistentResult.error?.code).toMatch(/not_found|invalid/i);

    // Invalid create (invalid product_id)
    const invalidCreate = await StoreSdk.admin.orders.create({
      line_items: [{ product_id: 0 as unknown as number, quantity: 1 }],
    });
    expect(invalidCreate.error).toBeTruthy();

    // Update non-existent
    const invalidUpdate = await StoreSdk.admin.orders.update(999999, {
      status: 'cancelled',
    });
    expect(invalidUpdate.error).toBeTruthy();

    // Delete non-existent
    const invalidDelete = await StoreSdk.admin.orders.delete(999999);
    expect(invalidDelete.error).toBeTruthy();
  });

  it('retrieves order in different contexts', async () => {
    const listResult = await StoreSdk.admin.orders.list({ per_page: 1 });
    expect(listResult.error).toBeFalsy();

    if (listResult.data && listResult.data.length > 0) {
      const orderId = listResult.data[0].id;

      const viewResult = await StoreSdk.admin.orders.get(orderId, {
        context: 'view',
      });
      expect(viewResult.error).toBeFalsy();
      expect(viewResult.data).toBeTruthy();
      expect(viewResult.data?.id).toBe(orderId);

      const editResult = await StoreSdk.admin.orders.get(orderId, {
        context: 'edit',
      });
      expect(editResult.error).toBeFalsy();
      expect(editResult.data).toBeTruthy();
      expect(editResult.data?.id).toBe(orderId);
    }
  });

  it('retrieves order statuses summary', async () => {
    const statuses = await StoreSdk.admin.orders.getStatuses();
    expect(statuses.error).toBeFalsy();
    expect(Array.isArray(statuses.data)).toBe(true);
    if (statuses.data && statuses.data.length > 0) {
      expect(typeof statuses.data[0].slug).toBe('string');
      if (statuses.data[0].total) {
        expect(typeof statuses.data[0].total).toBe('number');
      }
    }
  });

  it('manages order notes (create/list/get/delete)', async () => {
    // Ensure we have a product to create an order
    const prodList = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(prodList.error).toBeFalsy();
    expect(prodList.data && prodList.data.length > 0).toBe(true);
    if (!prodList.data || prodList.data.length === 0) return;

    const productId = prodList.data[0].id;

    // Create an order to attach notes to
    const createOrder = await StoreSdk.admin.orders.create({
      status: 'pending',
      line_items: [{ product_id: productId, quantity: 1 }],
      billing: {
        first_name: 'Note',
        last_name: 'Tester',
        company: '',
        address_1: '9 Note St',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
        email: `notes-${Date.now()}@example.com`,
        phone: '555-000-0000',
      },
      shipping: {
        first_name: 'Note',
        last_name: 'Tester',
        company: '',
        address_1: '9 Note St',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
      },
    });
    expect(createOrder.error).toBeFalsy();
    if (!createOrder.data) return;
    const orderId = createOrder.data.id;

    // Create a note
    const noteText = `Integration note ${Date.now()}`;
    const createNote = await StoreSdk.admin.orders.createNote(orderId, {
      note: noteText,
      customer_note: false,
    });
    expect(createNote.error).toBeFalsy();
    expect(createNote.data).toBeTruthy();
    const noteId = createNote.data?.id as number;

    // List notes and verify presence
    const listNotes = await StoreSdk.admin.orders.listNotes(orderId, {
      type: 'any',
    });
    expect(listNotes.error).toBeFalsy();
    expect(Array.isArray(listNotes.data)).toBe(true);
    if (listNotes.data) {
      const found = listNotes.data.some((n) => n.id === noteId);
      expect(found).toBe(true);
    }

    // Get the note
    const getNote = await StoreSdk.admin.orders.getNote(orderId, noteId);
    expect(getNote.error).toBeFalsy();
    expect(getNote.data?.id).toBe(noteId);

    // Delete the note
    const deleteNote = await StoreSdk.admin.orders.deleteNote(
      orderId,
      noteId,
      true
    );
    expect(deleteNote.error).toBeFalsy();

    // Cleanup order
    await StoreSdk.admin.orders.delete(orderId, true);
  });

  it('generates and fetches receipt (if supported)', async () => {
    // Prepare an order
    const prodList = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(prodList.error).toBeFalsy();
    if (!prodList.data || prodList.data.length === 0) return;

    const productId = prodList.data[0].id;
    const order = await StoreSdk.admin.orders.create({
      status: 'pending',
      line_items: [{ product_id: productId, quantity: 1 }],
      billing: {
        first_name: 'Receipt',
        last_name: 'Tester',
        company: '',
        address_1: '7 Receipt Ave',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
        email: `receipt-${Date.now()}@example.com`,
        phone: '555-111-1111',
      },
      shipping: {
        first_name: 'Receipt',
        last_name: 'Tester',
        company: '',
        address_1: '7 Receipt Ave',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
      },
    });
    expect(order.error).toBeFalsy();
    if (!order.data) return;
    const orderId = order.data.id;

    // Generate receipt
    const gen = await StoreSdk.admin.orders.generateReceipt(orderId, {
      force_new: true,
    });
    // Either supported (data) or not (error) depending on env
    if (gen.error) {
      expect(gen.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(gen.data?.receipt_url).toMatch(/^http?:\/\//);
    }

    // Fetch receipt
    const get = await StoreSdk.admin.orders.getReceipt(orderId);
    if (get.error) {
      expect(get.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(get.data?.receipt_url).toMatch(/^https?:\/\//);
    }

    // Cleanup
    await StoreSdk.admin.orders.delete(orderId, true);
  });

  it('retrieves email templates and can send emails (if supported)', async () => {
    // Prepare an order
    const prodList = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(prodList.error).toBeFalsy();
    if (!prodList.data || prodList.data.length === 0) return;

    const productId = prodList.data[0].id;
    const order = await StoreSdk.admin.orders.create({
      status: 'pending',
      line_items: [{ product_id: productId, quantity: 1 }],
      billing: {
        first_name: 'Email',
        last_name: 'Tester',
        company: '',
        address_1: '5 Mail Rd',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
        email: `email-${Date.now()}@example.com`,
        phone: '555-222-2222',
      },
      shipping: {
        first_name: 'Email',
        last_name: 'Tester',
        company: '',
        address_1: '5 Mail Rd',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
      },
    });
    expect(order.error).toBeFalsy();
    if (!order.data) return;
    const orderId = order.data.id;

    // Get templates
    const templates = await StoreSdk.admin.orders.getEmailTemplates(orderId);
    if (templates.error) {
      expect(templates.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(Array.isArray(templates.data)).toBe(true);

      // Attempt to send email with first available template
      if (templates.data && templates.data.length > 0) {
        const templateId = templates.data[0]
          .id as unknown as AdminOrderEmailTemplateId; // use returned template id
        const sent = await StoreSdk.admin.orders.sendEmail(orderId, {
          template_id: templateId,
          email: `notify-${Date.now()}@example.com`,
          force_email_update: true,
        });
        if (sent.error) {
          expect(sent.error.code).toMatch(
            /not_found|invalid|forbidden|unsupported/i
          );
        } else {
          expect(sent.data?.message).toBeTruthy();
        }
      }
    }

    // Send order details
    const details = await StoreSdk.admin.orders.sendOrderDetails(orderId, {
      email: `details-${Date.now()}@example.com`,
      force_email_update: true,
    });
    if (details.error) {
      expect(details.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i
      );
    } else {
      expect(details.data?.message).toBeTruthy();
    }

    // Cleanup
    await StoreSdk.admin.orders.delete(orderId, true);
  });

  it('lists refunds globally (no single-refund fetch via global endpoint)', async () => {
    const list = await StoreSdk.admin.refunds.list({ per_page: 1 });
    expect(list.error).toBeFalsy();
    expect(Array.isArray(list.data)).toBe(true);
  });

  it('creates, lists, gets and deletes an order refund', async () => {
    // Ensure we have a product to create an order
    const prodList = await StoreSdk.admin.products.list({ per_page: 1 });
    expect(prodList.error).toBeFalsy();
    if (!prodList.data || prodList.data.length === 0) {
      throw new Error('No products found');
    }

    const productId = prodList.data[0].id;

    // Create an order with a single line item
    const createOrder = await StoreSdk.admin.orders.create({
      status: 'pending',
      line_items: [{ product_id: productId, quantity: 1 }],
      billing: {
        first_name: 'Refund',
        last_name: 'Tester',
        company: '',
        address_1: '10 Refund St',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
        email: `refund-${Date.now()}@example.com`,
      },
      shipping: {
        first_name: 'Refund',
        last_name: 'Tester',
        company: '',
        address_1: '10 Refund St',
        address_2: '',
        city: 'Testville',
        state: 'CA',
        postcode: '94016',
        country: 'US',
      },
    });
    expect(createOrder.error).toBeFalsy();
    expect(createOrder.data).toBeTruthy();
    if (!createOrder.data) return;
    const orderId = createOrder.data.id;

    try {
      // Read line items to compute a safe refund payload
      const order = await StoreSdk.admin.orders.get(orderId);
      expect(order.error).toBeFalsy();
      if (
        !order.data ||
        !order.data.line_items ||
        order.data.line_items.length === 0
      )
        return;

      const firstItem = order.data.line_items[0];
      const itemTotal = firstItem.total || '0';

      // Create a refund without attempting gateway refund to keep environment-agnostic
      const createRefund = await StoreSdk.admin.orders.createRefund(orderId, {
        amount: itemTotal,
        reason: 'Integration test refund',
        refunded_payment: false,
        api_refund: false,
        api_restock: true,
        line_items: [
          {
            id: firstItem.id,
            quantity: 1,
          },
        ],
      });
      if (createRefund.error) {
        // Some environments may restrict refunds; assert acceptable error
        expect(createRefund.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i
        );
        // Skip the rest if creation failed for environmental reasons
        return;
      }
      expect(createRefund.data).toBeTruthy();
      if (!createRefund.data) return;
      const refundId = createRefund.data.id;

      // List refunds for the order
      const listRefunds = await StoreSdk.admin.orders.listRefunds(orderId, {
        per_page: 10,
      });
      expect(listRefunds.error).toBeFalsy();
      expect(Array.isArray(listRefunds.data)).toBe(true);
      if (listRefunds.data) {
        const found = listRefunds.data.some((r) => r.id === refundId);
        expect(found).toBe(true);
      }

      // Get the refund
      const getRefund = await StoreSdk.admin.orders.getRefund(
        orderId,
        refundId
      );
      expect(getRefund.error).toBeFalsy();
      expect(getRefund.data?.id).toBe(refundId);

      // Delete the refund
      const delRefund = await StoreSdk.admin.orders.deleteRefund(
        orderId,
        refundId,
        true
      );
      expect(delRefund.error).toBeFalsy();
    } finally {
      // Cleanup order
      await StoreSdk.admin.orders.delete(orderId, true);
    }
  });

  it('handles order refund get error for non-existent id', async () => {
    const res = await StoreSdk.admin.orders.getRefund(999999, 999999);
    expect(res.error).toBeTruthy();
    expect(res.error?.code).toMatch(/not_found|invalid/i);
  });
});

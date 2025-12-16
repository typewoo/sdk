import { describe, it, expect, beforeAll } from 'vitest';
import { AdminCustomerRequest, Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });

/**
 * Integration tests for Admin Customer Service
 * Pattern mirrors the admin coupon integration tests.
 */
describe('Integration: Admin Customer Service', () => {
  beforeAll(async () => {
    // Initialize SDK with admin authentication for admin operations
    await Typewoo.init({
      baseUrl: GET_WP_URL(),
      admin: {
        // Admin operations require consumer key/secret authentication
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists customers with pagination', async () => {
    const { data, error } = await Typewoo.admin.customers.list({
      per_page: 5,
      page: 1,
    });

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
  });

  it('searches customers by email or name', async () => {
    // Try a generic query that should be safe (e.g., 'test' or domain fragment)
    const query = 'customer';
    const { data, error } = await Typewoo.admin.customers.list({
      search: query,
      per_page: 10,
    });

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);

    if (data && data.length > 0) {
      const hasSearchTerm = data.some((c) => {
        const haystack = [c.email, c.first_name, c.last_name, c.username]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
      expect(hasSearchTerm).toBe(true);
    }
  });

  it('creates, retrieves, updates, and deletes a customer', async () => {
    const ts = Date.now();
    const testCustomerData: AdminCustomerRequest = {
      email: `itest-${ts}@example.com`,
      username: `itest-user-${ts}`,
      password: `P@ss-${ts}-Aa!`,
      first_name: 'ITest',
      last_name: 'User',
    };

    // Create customer
    const createResult = await Typewoo.admin.customers.create(testCustomerData);

    expect(createResult.error).toBeFalsy();
    expect(createResult.data).toBeTruthy();

    if (!createResult.data) throw new Error('Failed to create test customer');

    expect(createResult.data.email).toBe(testCustomerData.email);
    expect(createResult.data.username).toBe(testCustomerData.username);

    // Retrieve the created customer
    const getResult = await Typewoo.admin.customers.get(createResult.data.id);
    expect(getResult.error).toBeFalsy();
    expect(getResult.data).toBeTruthy();
    expect(getResult.data?.id).toBe(createResult.data.id);
    expect(getResult.data?.email).toBe(testCustomerData.email);

    // Update the customer
    const updateData: AdminCustomerRequest = {
      first_name: 'Updated',
      last_name: 'Customer',
    };

    const updateResult = await Typewoo.admin.customers.update(
      createResult.data.id,
      updateData
    );
    expect(updateResult.error).toBeFalsy();
    expect(updateResult.data).toBeTruthy();
    expect(updateResult.data?.first_name).toBe(updateData.first_name);
    expect(updateResult.data?.last_name).toBe(updateData.last_name);

    // Delete the customer (force delete; reassign 0)
    const deleteResult = await Typewoo.admin.customers.delete(
      createResult.data.id,
      true,
      0
    );
    expect(deleteResult.error).toBeFalsy();
    expect(deleteResult.data).toBeTruthy();

    // Verify customer is deleted
    const getDeletedResult = await Typewoo.admin.customers.get(
      createResult.data.id
    );
    expect(getDeletedResult.error).toBeTruthy();
    expect(getDeletedResult.error?.code).toMatch(/not_found|invalid/i);
  });

  it('handles batch operations', async () => {
    const ts = Date.now();
    const batchData = {
      create: [
        {
          email: `batch1-${ts}@example.com`,
          username: `batch-user-1-${ts}`,
          password: `P@ss-${ts}-Aa!`,
          first_name: 'Batch',
          last_name: 'One',
        },
        {
          email: `batch2-${ts}@example.com`,
          username: `batch-user-2-${ts}`,
          password: `P@ss-${ts + 1}-Aa!`,
          first_name: 'Batch',
          last_name: 'Two',
        },
      ] as AdminCustomerRequest[],
    };

    const batchResult = await Typewoo.admin.customers.batch(batchData);
    expect(batchResult.error).toBeFalsy();
    expect(batchResult.data).toBeTruthy();

    if (batchResult.data) {
      expect(Array.isArray(batchResult.data.create)).toBe(true);
      expect(batchResult.data.create).toHaveLength(2);

      const created1 = batchResult.data.create[0];
      const created2 = batchResult.data.create[1];

      expect(created1.email).toBe(batchData.create[0].email);
      expect(created1.username).toBe(batchData.create[0].username);

      expect(created2.email).toBe(batchData.create[1].email);
      expect(created2.username).toBe(batchData.create[1].username);

      // Clean up - delete the created customers
      await Promise.all([
        Typewoo.admin.customers.delete(created1.id, true, 0),
        Typewoo.admin.customers.delete(created2.id, true, 0),
      ]);
    }
  });

  it('handles error cases gracefully', async () => {
    // Get non-existent customer
    const nonExistentResult = await Typewoo.admin.customers.get(999999);
    expect(nonExistentResult.error).toBeTruthy();
    expect(nonExistentResult.error?.code).toMatch(/not_found|invalid/i);

    // Create with invalid data
    const invalidCreateResult = await Typewoo.admin.customers.create({
      email: 'not-an-email',
      username: '',
    });
    expect(invalidCreateResult.error).toBeTruthy();

    // Update non-existent customer
    const invalidUpdateResult = await Typewoo.admin.customers.update(999999, {
      first_name: 'Nope',
    });
    expect(invalidUpdateResult.error).toBeTruthy();

    // Delete non-existent customer
    const invalidDeleteResult = await Typewoo.admin.customers.delete(999999);
    expect(invalidDeleteResult.error).toBeTruthy();
  });

  it('retrieves customer in different contexts', async () => {
    // First get list to find an existing customer
    const listResult = await Typewoo.admin.customers.list({ per_page: 1 });
    expect(listResult.error).toBeFalsy();

    if (listResult.data && listResult.data.length > 0) {
      const customerId = listResult.data[0].id;

      // view context
      const viewResult = await Typewoo.admin.customers.get(customerId, {
        context: 'view',
      });
      expect(viewResult.error).toBeFalsy();
      expect(viewResult.data).toBeTruthy();
      expect(viewResult.data?.id).toBe(customerId);

      // edit context
      const editResult = await Typewoo.admin.customers.get(customerId, {
        context: 'edit',
      });
      expect(editResult.error).toBeFalsy();
      expect(editResult.data).toBeTruthy();
      expect(editResult.data?.id).toBe(customerId);
    }
  });
});

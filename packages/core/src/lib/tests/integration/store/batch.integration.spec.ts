import { describe, it, expect, beforeAll } from 'vitest';
import { BatchRequest, StoreSdk } from '../../../../index.js';
import { GET_WP_URL } from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import z from 'zod';

config({ path: resolve(__dirname, '../../../../../../../.env') });

const WP_URL = GET_WP_URL();

describe('Integration: Batch API Operations', () => {
  beforeAll(async () => {
    await StoreSdk.init({ baseUrl: WP_URL });
  });

  it('executes batch request with multiple operations', async () => {
    // Test batch operation with cart get and product listing
    const batchRequest: z.infer<typeof BatchRequest> = {
      validation: 'normal',
      requests: [
        {
          method: 'POST',
          path: '/wc/store/v1/cart',
        },
        {
          method: 'POST',
          path: '/wc/store/v1/products?per_page=2',
        },
      ],
    };

    const res = await StoreSdk.store.batch.batch(batchRequest);

    if (res.error) {
      // Batch API might not be supported on all installations
      expect(res.error.code).toMatch(
        /batch|not.*found|not.*supported|method.*not.*allowed/i
      );
      expect(res.data).toBeFalsy();
    } else {
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(Array.isArray(res.data.responses)).toBe(true);
        expect(res.data.responses).toHaveLength(2);

        // First response should be cart data
        expect(res.data.responses[0]).toHaveProperty('status');
        expect(res.data.responses[0]).toHaveProperty('body');

        // Second response should be products data
        expect(res.data.responses[1]).toHaveProperty('status');
        expect(res.data.responses[1]).toHaveProperty('body');
      }
    }
  });

  it('handles batch request with require-all-validate mode', async () => {
    const batchRequest: z.infer<typeof BatchRequest> = {
      validation: 'require-all-validate',
      requests: [
        {
          method: 'POST',
          path: '/wp-json/wc/store/v1/cart',
        },
      ],
    };

    const res = await StoreSdk.store.batch.batch(batchRequest);

    if (res.error) {
      // Batch API or validation mode might not be supported
      expect(res.error.code).toMatch(
        /batch|validation|not.*found|not.*supported/i
      );
    } else {
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(Array.isArray(res.data.responses)).toBe(true);
        expect(res.data.responses.length).toBeGreaterThan(0);
      }
    }
  });

  it('handles empty batch request', async () => {
    const batchRequest = {
      requests: [],
    };

    const res = await StoreSdk.store.batch.batch(batchRequest);

    if (res.error) {
      // Should get validation error for empty requests
      expect(res.error.code).toMatch(/empty|invalid|validation|required/i);
    } else {
      expect(res.data).toBeTruthy();
      if (res.data) {
        expect(Array.isArray(res.data.responses)).toBe(true);
        expect(res.data.responses).toHaveLength(0);
      }
    }
  });
});

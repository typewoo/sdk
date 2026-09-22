import { describe, it, expect } from 'vitest';
import {
  CheckoutCreateRequestSchema,
  CheckoutResponseSchema,
  type CheckoutCreateRequest,
} from '../../../types/store/checkout/index.js';

describe('checkout schemas', () => {
  it('accept any payment gateway id, not only the core ones', () => {
    const request: CheckoutCreateRequest = { payment_method: 'stripe' };
    expect(CheckoutCreateRequestSchema.safeParse(request).success).toBe(true);

    const response = CheckoutResponseSchema.safeParse({
      order_id: 1,
      status: 'processing',
      order_key: 'wc_order_abc',
      order_number: '1',
      customer_note: '',
      customer_id: 0,
      billing_address: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        email: '',
        phone: '',
      },
      payment_method: 'woocommerce_payments',
      payment_result: { payment_status: 'success', payment_details: [] },
    });
    expect(response.success).toBe(true);
  });

  it('accept payment_data key/value pairs for the gateway', () => {
    const request: CheckoutCreateRequest = {
      payment_method: 'stripe',
      payment_data: [{ key: 'stripe_source', value: 'src_123' }],
    };
    expect(CheckoutCreateRequestSchema.safeParse(request).success).toBe(true);
  });

  it('reject malformed payment_data entries', () => {
    const result = CheckoutCreateRequestSchema.safeParse({
      payment_data: [{ key: 'stripe_source' }],
    });
    expect(result.success).toBe(false);
  });
});

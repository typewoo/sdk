import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  AdminOrderItemMetaDataSchema,
  AdminOrderLineItemSchema,
  AdminOrderSendEmailRequestSchema,
  AdminPaymentGatewayUpdateRequestSchema,
  AdminRefundLineItemSchema,
  type AdminOrderEmailTemplateId,
  type AdminOrderSendEmailRequest,
  type AdminPaymentGatewayUpdateRequest,
} from '../../../../index.js';

describe('AdminOrderSendEmailRequest', () => {
  it('keeps its declared field types', () => {
    expectTypeOf<AdminOrderSendEmailRequest['email']>().toEqualTypeOf<
      string | undefined
    >();
    // @ts-expect-error email must be a string
    const bad: AdminOrderSendEmailRequest = { email: 42 };
    expect(AdminOrderSendEmailRequestSchema.safeParse(bad).success).toBe(false);
  });

  it('accepts core and extension template IDs', () => {
    const core: AdminOrderSendEmailRequest = {
      template_id: 'customer_invoice',
    };
    const custom: AdminOrderSendEmailRequest = { template_id: 'my_ext_email' };
    type TemplateId = NonNullable<AdminOrderSendEmailRequest['template_id']>;
    expectTypeOf<AdminOrderEmailTemplateId>().toExtend<TemplateId>();
    // The core IDs survive in the union (for autocomplete) instead of
    // collapsing into plain `string`.
    expectTypeOf<TemplateId>().not.toEqualTypeOf<string>();
    for (const request of [core, custom]) {
      expect(AdminOrderSendEmailRequestSchema.safeParse(request).success).toBe(
        true
      );
    }
  });
});

const lineItem = {
  id: 1,
  name: 'Deleted product',
  product_id: 0,
  variation_id: 0,
  quantity: 1,
  tax_class: '',
  subtotal: '10.00',
  subtotal_tax: '0.00',
  total: '10.00',
  total_tax: '0.00',
  taxes: [],
  meta_data: [
    {
      id: 3,
      key: 'addons',
      value: ['gift-wrap'],
      display_key: 'addons',
      display_value: ['gift-wrap'],
    },
  ],
  sku: null,
  global_unique_id: null,
  price: 10,
  image: { id: 5, src: false },
  parent_name: null,
};

describe('order and refund line items', () => {
  it('accept a line item whose product or image was deleted', () => {
    expect(AdminOrderLineItemSchema.safeParse(lineItem).success).toBe(true);
    expect(
      AdminRefundLineItemSchema.safeParse({ ...lineItem, quantity: -1 }).success
    ).toBe(true);
  });

  it('accept non-string display values on item meta', () => {
    expect(
      AdminOrderItemMetaDataSchema.safeParse({
        id: 1,
        key: 'k',
        value: { a: 1 },
        display_key: 'k',
        display_value: { a: 1 },
      }).success
    ).toBe(true);
  });
});

describe('AdminPaymentGatewayUpdateRequest', () => {
  it('accepts array values for multiselect settings', () => {
    const request: AdminPaymentGatewayUpdateRequest = {
      settings: { title: 'COD', enable_for_methods: ['flat_rate'] },
    };
    expect(
      AdminPaymentGatewayUpdateRequestSchema.safeParse(request).success
    ).toBe(true);
  });
});

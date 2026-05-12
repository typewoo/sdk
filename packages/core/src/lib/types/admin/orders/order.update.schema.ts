import { z } from 'zod';
import {
  AdminOrderAddress,
  AdminOrderMetaData,
  WC_CURRENCIES,
} from './order.js';
import {
  AdminOrderLineItemSchema,
  AdminOrderShippingLineSchema,
  AdminOrderFeeLineSchema,
  AdminOrderCouponLineSchema,
} from './order.schema.js';

/**
 * Order request parameters for PUT /orders/{id} (update).
 */
export const AdminOrderUpdateRequestSchema = z.looseObject({
  parent_id: z.number().optional().describe('Parent order ID.'),
  status: z
    .enum([
      'auto-draft',
      'cancelled',
      'checkout-draft',
      'completed',
      'failed',
      'on-hold',
      'pending',
      'processing',
      'refunded',
    ])
    .optional()
    .describe('Order status.'),
  currency: z
    .enum(WC_CURRENCIES)
    .optional()
    .describe('Currency the order was created with, in ISO format.'),
  customer_id: z
    .number()
    .optional()
    .describe('User ID who owns the order. 0 for guests.'),
  customer_note: z
    .string()
    .optional()
    .describe('Note left by customer during checkout.'),
  billing: AdminOrderAddress.optional().describe('Billing address.'),
  shipping: AdminOrderAddress.omit({ email: true, phone: true })
    .optional()
    .describe('Shipping address.'),
  payment_method: z.string().optional().describe('Payment method ID.'),
  payment_method_title: z.string().optional().describe('Payment method title.'),
  transaction_id: z.string().optional().describe('Unique transaction ID.'),
  meta_data: z.array(AdminOrderMetaData).optional().describe('Meta data.'),
  line_items: z
    .array(AdminOrderLineItemSchema.partial())
    .optional()
    .describe('Line items data.'),
  shipping_lines: z
    .array(AdminOrderShippingLineSchema.partial())
    .optional()
    .describe('Shipping lines data.'),
  fee_lines: z
    .array(AdminOrderFeeLineSchema.partial())
    .optional()
    .describe('Fee lines data.'),
  coupon_lines: z
    .array(AdminOrderCouponLineSchema.partial())
    .optional()
    .describe('Coupons line data.'),
  set_paid: z
    .boolean()
    .optional()
    .describe(
      'Define if the order is paid. It will set the status to processing and reduce stock items.'
    ),
  created_via: z
    .string()
    .optional()
    .describe('Shows where the order was created.'),
  id: z.number().optional().describe('Unique identifier for the resource.'),
  manual_update: z
    .boolean()
    .optional()
    .describe(
      'Set the action as manual so that the order note registers as "added by user".'
    ),
});

export type AdminOrderUpdateRequest = z.input<
  typeof AdminOrderUpdateRequestSchema
>;

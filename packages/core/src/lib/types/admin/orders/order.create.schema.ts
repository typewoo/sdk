import { z } from 'zod';
import { AdminMetaDataInputSchema } from '../meta-data.schema.js';
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

const REMOVE_LINE_NOTE = "Pass null (with the item's id) to remove the line.";

/**
 * Line item sent in an order create or update request.
 */
export const AdminOrderLineItemInputSchema =
  AdminOrderLineItemSchema.partial().extend({
    name: z
      .string()
      .nullable()
      .optional()
      .describe(`Product name. ${REMOVE_LINE_NOTE}`),
    product_id: z
      .number()
      .nullable()
      .optional()
      .describe(`Product ID. ${REMOVE_LINE_NOTE}`),
    meta_data: z
      .array(AdminMetaDataInputSchema)
      .optional()
      .describe('Meta data.'),
  });

export type AdminOrderLineItemInput = z.input<
  typeof AdminOrderLineItemInputSchema
>;

/**
 * Shipping line sent in an order create or update request.
 */
export const AdminOrderShippingLineInputSchema =
  AdminOrderShippingLineSchema.partial().extend({
    method_title: z
      .string()
      .nullable()
      .optional()
      .describe(`Shipping method name. ${REMOVE_LINE_NOTE}`),
    method_id: z
      .string()
      .nullable()
      .optional()
      .describe(`Shipping method ID. ${REMOVE_LINE_NOTE}`),
    meta_data: z
      .array(AdminMetaDataInputSchema)
      .optional()
      .describe('Meta data.'),
  });

export type AdminOrderShippingLineInput = z.input<
  typeof AdminOrderShippingLineInputSchema
>;

/**
 * Fee line sent in an order create or update request.
 */
export const AdminOrderFeeLineInputSchema =
  AdminOrderFeeLineSchema.partial().extend({
    name: z
      .string()
      .nullable()
      .optional()
      .describe(`Fee name. ${REMOVE_LINE_NOTE}`),
    meta_data: z
      .array(AdminMetaDataInputSchema)
      .optional()
      .describe('Meta data.'),
  });

export type AdminOrderFeeLineInput = z.input<
  typeof AdminOrderFeeLineInputSchema
>;

/**
 * Coupon line sent in an order create or update request.
 */
export const AdminOrderCouponLineInputSchema =
  AdminOrderCouponLineSchema.partial().extend({
    code: z
      .string()
      .nullable()
      .optional()
      .describe(`Coupon code. ${REMOVE_LINE_NOTE}`),
    meta_data: z
      .array(AdminMetaDataInputSchema)
      .optional()
      .describe('Meta data.'),
  });

export type AdminOrderCouponLineInput = z.input<
  typeof AdminOrderCouponLineInputSchema
>;

/**
 * Order request parameters for POST /orders (create). WooCommerce accepts
 * an empty body to create a draft order, so all fields are optional.
 */
export const AdminOrderCreateRequestSchema = z.looseObject({
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
    .default('pending')
    .optional()
    .describe('Order status.'),
  currency: z
    .enum(WC_CURRENCIES)
    .default('EUR')
    .optional()
    .describe('Currency the order was created with, in ISO format.'),
  customer_id: z
    .number()
    .default(0)
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
  meta_data: z
    .array(AdminMetaDataInputSchema)
    .optional()
    .describe('Meta data.'),
  line_items: z
    .array(AdminOrderLineItemInputSchema)
    .optional()
    .describe('Line items data.'),
  shipping_lines: z
    .array(AdminOrderShippingLineInputSchema)
    .optional()
    .describe('Shipping lines data.'),
  fee_lines: z
    .array(AdminOrderFeeLineInputSchema)
    .optional()
    .describe('Fee lines data.'),
  coupon_lines: z
    .array(AdminOrderCouponLineInputSchema)
    .optional()
    .describe('Coupons line data.'),
  set_paid: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'Define if the order is paid. It will set the status to processing and reduce stock items.'
    ),
  created_via: z
    .string()
    .optional()
    .describe('Shows where the order was created.'),
  manual_update: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'Set the action as manual so that the order note registers as "added by user".'
    ),
});

export type AdminOrderCreateRequest = z.input<
  typeof AdminOrderCreateRequestSchema
>;

import { z } from 'zod';
import {
  AdminOrderAddress,
  AdminOrderMetaData,
  WC_CURRENCIES,
} from './order.js';

/**
 * Line item in an order
 */
export const AdminOrderLineItemSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  product_id: z.number(),
  variation_id: z.number(),
  quantity: z.number(),
  tax_class: z.string(),
  subtotal: z.string(),
  subtotal_tax: z.string(),
  total: z.string(),
  total_tax: z.string(),
  taxes: z.array(
    z.object({
      id: z.number(),
      total: z.string(),
      subtotal: z.string(),
    })
  ),
  meta_data: z.array(AdminOrderMetaData).describe('Meta data.'),
  sku: z.string(),
  price: z.string(),
  image: z.object({
    id: z.string(),
    src: z.string(),
  }),
  parent_name: z.string().optional(),
});

export type AdminOrderLineItem = z.infer<typeof AdminOrderLineItemSchema>;

/**
 * Tax line in an order
 */
export const AdminOrderTaxLineSchema = z.looseObject({
  id: z.number(),
  rate_code: z.string(),
  rate_id: z.number(),
  label: z.string(),
  compound: z.boolean(),
  tax_total: z.string(),
  shipping_tax_total: z.string(),
  rate_percent: z.number(),
  meta_data: z.array(AdminOrderMetaData).describe('Meta data.'),
});

export type AdminOrderTaxLine = z.infer<typeof AdminOrderTaxLineSchema>;

/**
 * Shipping line in an order
 */
export const AdminOrderShippingLineSchema = z.looseObject({
  id: z.number(),
  method_title: z.string(),
  method_id: z.string(),
  instance_id: z.string(),
  total: z.string(),
  total_tax: z.string(),
  taxes: z.array(
    z.object({
      id: z.number(),
      total: z.string(),
    })
  ),
  meta_data: z.array(AdminOrderMetaData).describe('Meta data.'),
});

export type AdminOrderShippingLine = z.infer<
  typeof AdminOrderShippingLineSchema
>;

/**
 * Fee line in an order
 */
export const AdminOrderFeeLineSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  tax_class: z.string(),
  tax_status: z.enum(['taxable', 'none']),
  total: z.string(),
  total_tax: z.string(),
  taxes: z.array(
    z.object({
      id: z.number(),
      total: z.string(),
      subtotal: z.string(),
    })
  ),
  meta_data: z.array(AdminOrderMetaData).describe('Meta data.'),
});

export type AdminOrderFeeLine = z.infer<typeof AdminOrderFeeLineSchema>;

/**
 * Coupon line in an order
 */
export const AdminOrderCouponLineSchema = z.looseObject({
  id: z.number(),
  code: z.string(),
  discount: z.string(),
  discount_tax: z.string(),
  meta_data: z.array(AdminOrderMetaData).describe('Meta data.'),
});

export type AdminOrderCouponLine = z.infer<typeof AdminOrderCouponLineSchema>;

/**
 * Order refund
 */
export const AdminOrderRefundSchema = z.looseObject({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  amount: z.string().optional(),
  reason: z.string().optional(),
  refunded_by: z.number().optional(),
  refunded_payment: z.boolean(),
  meta_data: z.array(AdminOrderMetaData).optional().describe('Meta data.'),
  line_items: z
    .array(AdminOrderLineItemSchema)
    .optional()
    .describe('Line items data.'),
  api_refund: z.boolean().optional(),
  api_restock: z.boolean().optional(),
});

export type AdminOrderRefund = z.infer<typeof AdminOrderRefundSchema>;

/**
 * WooCommerce REST API Order Response
 */
export const AdminOrderSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
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
  version: z
    .string()
    .describe('Version of WooCommerce which last updated the order.'),
  prices_include_tax: z
    .boolean()
    .describe('True the prices included tax during checkout.'),
  date_created: z
    .string()
    .describe("The date the order was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the order was created, as GMT.'),
  date_modified: z
    .string()
    .describe("The date the order was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .describe('The date the order was last modified, as GMT.'),
  discount_total: z.string().describe('Total discount amount for the order.'),
  discount_tax: z.string().describe('Total discount tax amount for the order.'),
  shipping_total: z.string().describe('Total shipping amount for the order.'),
  shipping_tax: z.string().describe('Total shipping tax amount for the order.'),
  cart_tax: z.string().describe('Sum of line item taxes only.'),
  total: z.string().describe('Grand total.'),
  total_tax: z.string().describe('Sum of all taxes.'),
  customer_id: z
    .number()
    .default(0)
    .optional()
    .describe('User ID who owns the order. 0 for guests.'),
  order_key: z.string().describe('Order key.'),
  billing: AdminOrderAddress.optional().describe('Billing address.'),
  shipping: AdminOrderAddress.omit({ email: true, phone: true })
    .optional()
    .describe('Shipping address.'),
  payment_method: z.string().optional().describe('Payment method ID.'),
  payment_method_title: z.string().optional().describe('Payment method title.'),
  transaction_id: z.string().optional().describe('Unique transaction ID.'),
  customer_ip_address: z.string().describe("Customer's IP address."),
  customer_user_agent: z.string().describe('User agent of the customer.'),
  created_via: z
    .string()
    .optional()
    .describe('Shows where the order was created.'),
  customer_note: z
    .string()
    .optional()
    .describe('Note left by customer during checkout.'),
  date_completed: z
    .string()
    .describe("The date the order was completed, in the site's timezone."),
  date_paid: z
    .string()
    .describe("The date the order was paid, in the site's timezone."),
  cart_hash: z
    .string()
    .describe('MD5 hash of cart items to ensure orders are not modified.'),
  number: z.string().describe('Order number.'),
  meta_data: z.array(AdminOrderMetaData).optional().describe('Meta data.'),
  line_items: z
    .array(AdminOrderLineItemSchema)
    .optional()
    .describe('Line items data.'),
  tax_lines: z.array(AdminOrderTaxLineSchema).describe('Tax lines data.'),
  shipping_lines: z
    .array(AdminOrderShippingLineSchema)
    .optional()
    .describe('Shipping lines data.'),
  fee_lines: z
    .array(AdminOrderFeeLineSchema)
    .optional()
    .describe('Fee lines data.'),
  coupon_lines: z
    .array(AdminOrderCouponLineSchema)
    .optional()
    .describe('Coupons line data.'),
  refunds: z.array(AdminOrderRefundSchema).describe('List of refunds.'),
  payment_url: z.string().describe('Order payment URL.'),
  is_editable: z.boolean().describe('Whether an order can be edited.'),
  needs_payment: z
    .boolean()
    .describe(
      'Whether an order needs payment, based on status and order total.'
    ),
  needs_processing: z
    .boolean()
    .describe('Whether an order needs processing before it can be completed.'),
  date_completed_gmt: z
    .string()
    .optional()
    .describe('The date the order was completed, as GMT.'),
  date_paid_gmt: z
    .string()
    .optional()
    .describe('The date the order was paid, as GMT.'),
  manual_update: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'Set the action as manual so that the order note registers as "added by user".'
    ),
  set_paid: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'Define if the order is paid. It will set the status to processing and reduce stock items.'
    ),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      customer: z.array(z.object({ href: z.string() })).optional(),
    })
    .optional(),
});

export type AdminOrder = z.infer<typeof AdminOrderSchema>;

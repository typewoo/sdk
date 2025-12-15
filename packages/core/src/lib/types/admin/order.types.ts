import { z } from 'zod';
import { AdminMetaData, AdminAddress } from './common.types.js';

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
  meta_data: z.array(AdminMetaData),
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
  meta_data: z.array(AdminMetaData),
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
  meta_data: z.array(AdminMetaData),
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
  meta_data: z.array(AdminMetaData),
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
  meta_data: z.array(AdminMetaData),
});

export type AdminOrderCouponLine = z.infer<typeof AdminOrderCouponLineSchema>;

/**
 * Order refund
 */
export const AdminOrderRefundSchema = z.looseObject({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  amount: z.string(),
  reason: z.string(),
  refunded_by: z.number(),
  refunded_payment: z.boolean(),
  meta_data: z.array(AdminMetaData),
  line_items: z.array(AdminOrderLineItemSchema),
  api_refund: z.boolean(),
  api_restock: z.boolean(),
});

export type AdminOrderRefund = z.infer<typeof AdminOrderRefundSchema>;

/**
 * WooCommerce REST API Order Response
 */
export const AdminOrderSchema = z.looseObject({
  id: z.number(),
  parent_id: z.number(),
  status: z.enum([
    'pending',
    'processing',
    'on-hold',
    'completed',
    'cancelled',
    'refunded',
    'failed',
    'checkout-draft',
  ]),
  currency: z.string(),
  version: z.string(),
  prices_include_tax: z.boolean(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  discount_total: z.string(),
  discount_tax: z.string(),
  shipping_total: z.string(),
  shipping_tax: z.string(),
  cart_tax: z.string(),
  total: z.string(),
  total_tax: z.string(),
  customer_id: z.number(),
  order_key: z.string(),
  billing: AdminAddress,
  shipping: AdminAddress.omit({ email: true, phone: true }),
  payment_method: z.string(),
  payment_method_title: z.string(),
  transaction_id: z.string(),
  customer_ip_address: z.string(),
  customer_user_agent: z.string(),
  created_via: z.string(),
  customer_note: z.string(),
  date_completed: z.string().nullable(),
  date_paid: z.string().nullable(),
  cart_hash: z.string(),
  number: z.string(),
  meta_data: z.array(AdminMetaData),
  line_items: z.array(AdminOrderLineItemSchema),
  tax_lines: z.array(AdminOrderTaxLineSchema),
  shipping_lines: z.array(AdminOrderShippingLineSchema),
  fee_lines: z.array(AdminOrderFeeLineSchema),
  coupon_lines: z.array(AdminOrderCouponLineSchema),
  refunds: z.array(AdminOrderRefundSchema),
  payment_url: z.string(),
  is_editable: z.boolean(),
  needs_payment: z.boolean(),
  needs_processing: z.boolean(),
  date_created_formatted: z.string(),
  status_transition: z.object({
    note: z.string(),
    from: z.string(),
    to: z.string(),
  }),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      customer: z.array(z.object({ href: z.string() })).optional(),
    })
    .optional(),
});

export type AdminOrder = z.infer<typeof AdminOrderSchema>;

/**
 * Order request parameters for creating/updating
 */
export const AdminOrderRequestSchema = z.looseObject({
  parent_id: z.number().optional(),
  status: z
    .enum([
      'pending',
      'processing',
      'on-hold',
      'completed',
      'cancelled',
      'refunded',
      'failed',
      'checkout-draft',
    ])
    .optional(),
  currency: z.string().optional(),
  customer_id: z.number().optional(),
  customer_note: z.string().optional(),
  billing: AdminAddress.optional(),
  shipping: AdminAddress.omit({ email: true, phone: true }).optional(),
  payment_method: z.string().optional(),
  payment_method_title: z.string().optional(),
  transaction_id: z.string().optional(),
  meta_data: z.array(AdminMetaData).optional(),
  line_items: z.array(AdminOrderLineItemSchema.partial()).optional(),
  shipping_lines: z.array(AdminOrderShippingLineSchema.partial()).optional(),
  fee_lines: z.array(AdminOrderFeeLineSchema.partial()).optional(),
  coupon_lines: z.array(AdminOrderCouponLineSchema.partial()).optional(),
  set_paid: z.boolean().optional(),
});

export type AdminOrderRequest = z.infer<typeof AdminOrderRequestSchema>;

/**
 * Order query parameters for listing
 */
export const AdminOrderQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  modified_after: z.string().optional(),
  modified_before: z.string().optional(),
  dates_are_gmt: z.boolean().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
    .optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
  status: z
    .enum([
      'pending',
      'processing',
      'on-hold',
      'completed',
      'cancelled',
      'refunded',
      'failed',
      'checkout-draft',
      'any',
      'trash',
    ])
    .optional(),
  customer: z.number().optional(),
  product: z.number().optional(),
  dp: z.number().optional(),
  include_meta: z.array(z.string()).optional(),
  exclude_meta: z.array(z.string()).optional(),
});

export type AdminOrderQueryParams = z.infer<typeof AdminOrderQueryParamsSchema>;

/**
 * Order note
 */
export const AdminOrderNoteSchema = z.looseObject({
  id: z.number(),
  author: z.string(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  note: z.string(),
  customer_note: z.boolean(),
  added_by_user: z.boolean(),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminOrderNote = z.infer<typeof AdminOrderNoteSchema>;

/**
 * Order note request parameters
 */
export const AdminOrderNoteRequestSchema = z.looseObject({
  note: z.string(),
  customer_note: z.boolean().optional(),
  added_by_user: z.boolean().optional(),
});

export type AdminOrderNoteRequest = z.infer<typeof AdminOrderNoteRequestSchema>;

/**
 * Order receipt generation request
 */
export const AdminOrderReceiptRequestSchema = z.looseObject({
  expiration_date: z.string().optional(),
  expiration_days: z.number().optional(),
  force_new: z.boolean().optional(),
});

export type AdminOrderReceiptRequest = z.infer<
  typeof AdminOrderReceiptRequestSchema
>;

/**
 * Order receipt response
 */
export const AdminOrderReceiptSchema = z.looseObject({
  id: z.string(),
  order_id: z.number(),
  receipt_url: z.string(),
  expiration_date: z.string(),
  created_date: z.string(),
});

export type AdminOrderReceipt = z.infer<typeof AdminOrderReceiptSchema>;

/**
 * Email template for orders
 */
export const AdminOrderEmailTemplateSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  subject: z.string(),
  heading: z.string(),
  enabled: z.boolean(),
});

export type AdminOrderEmailTemplate = z.infer<
  typeof AdminOrderEmailTemplateSchema
>;

/**
 * Send order email request
 */
export const AdminOrderSendEmailRequestSchema = z.looseObject({
  email: z.string().optional(),
  force_email_update: z.boolean().optional(),
  template_id: z.enum([
    'new_order',
    'cancelled_order',
    'customer_cancelled_order',
    'failed_order',
    'customer_failed_order',
    'customer_on_hold_order',
    'customer_processing_order',
    'customer_completed_order',
    'customer_refunded_order',
    'customer_invoice',
    'customer_note',
    'customer_reset_password',
    'customer_new_account',
    'customer_pos_completed_order',
    'customer_pos_refunded_order',
    'new_receipt',
  ]),
});

export type AdminOrderSendEmailRequest = z.infer<
  typeof AdminOrderSendEmailRequestSchema
>;

/**
 * Send order details request
 */
export const AdminOrderSendDetailsRequestSchema = z.looseObject({
  email: z.string().optional(),
  force_email_update: z.boolean().optional(),
});

export type AdminOrderSendDetailsRequest = z.infer<
  typeof AdminOrderSendDetailsRequestSchema
>;

/**
 * Available email template IDs
 */
export const AdminOrderEmailTemplateIdSchema = z.enum([
  'new_order',
  'cancelled_order',
  'customer_cancelled_order',
  'failed_order',
  'customer_failed_order',
  'customer_on_hold_order',
  'customer_processing_order',
  'customer_completed_order',
  'customer_refunded_order',
  'customer_invoice',
  'customer_note',
  'customer_reset_password',
  'customer_new_account',
  'customer_pos_completed_order',
  'customer_pos_refunded_order',
  'new_receipt',
]);

export type AdminOrderEmailTemplateId = z.infer<
  typeof AdminOrderEmailTemplateIdSchema
>;

/**
 * Order status information
 */
export const AdminOrderStatusInfoSchema = z.looseObject({
  slug: z.string(),
  name: z.string(),
  total: z.number(),
});

export type AdminOrderStatusInfo = z.infer<typeof AdminOrderStatusInfoSchema>;

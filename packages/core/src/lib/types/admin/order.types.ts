import { z } from 'zod';

const AdminOrderMetaData = z.object({
  id: z.number(),
  key: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), z.unknown()),
    z.null(),
  ]),
});

const AdminOrderAddress = z.object({
  first_name: z.string().describe('First name.'),
  last_name: z.string().describe('Last name.'),
  company: z.string().describe('Company name.'),
  address_1: z.string().describe('Address line 1'),
  address_2: z.string().describe('Address line 2'),
  city: z.string().describe('City name.'),
  state: z
    .string()
    .describe('ISO code or name of the state, province or district.'),
  postcode: z.string().describe('Postal code.'),
  country: z.string().describe('Country code in ISO 3166-1 alpha-2 format.'),
  email: z.string().optional().describe('Email address.'),
  phone: z.string().optional().describe('Phone number.'),
});

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
  meta_data: z.array(AdminOrderMetaData),
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
  meta_data: z.array(AdminOrderMetaData),
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
  meta_data: z.array(AdminOrderMetaData),
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
  meta_data: z.array(AdminOrderMetaData),
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
  meta_data: z.array(AdminOrderMetaData),
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
  meta_data: z.array(AdminOrderMetaData),
  line_items: z.array(AdminOrderLineItemSchema),
  api_refund: z.boolean(),
  api_restock: z.boolean(),
});

export type AdminOrderRefund = z.infer<typeof AdminOrderRefundSchema>;

/**
 * WooCommerce REST API Order Response
 */
export const AdminOrderSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  parent_id: z.number().describe('Parent order ID.'),
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
    .describe('Order status.'),
  currency: z
    .string()
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
  customer_id: z.number().describe('User ID who owns the order. 0 for guests.'),
  order_key: z.string().describe('Order key.'),
  billing: AdminOrderAddress,
  shipping: AdminOrderAddress.omit({ email: true, phone: true }).describe(
    'Billing address.'
  ),
  payment_method: z.string().describe('Payment method ID.'),
  payment_method_title: z.string().describe('Payment method title.'),
  transaction_id: z.string().describe('Unique transaction ID.'),
  customer_ip_address: z.string().describe("Customer's IP address."),
  customer_user_agent: z.string().describe('User agent of the customer.'),
  created_via: z.string().describe('Shows where the order was created.'),
  customer_note: z.string().describe('Note left by customer during checkout.'),
  date_completed: z
    .string()
    .nullable()
    .describe("The date the order was completed, in the site's timezone."),
  date_paid: z
    .string()
    .nullable()
    .describe("The date the order was paid, in the site's timezone."),
  cart_hash: z
    .string()
    .describe('MD5 hash of cart items to ensure orders are not modified.'),
  number: z.string().describe('Order number.'),
  meta_data: z.array(AdminOrderMetaData).describe('Meta data.'),
  line_items: z.array(AdminOrderLineItemSchema).describe('Line items data.'),
  tax_lines: z.array(AdminOrderTaxLineSchema).describe('Tax lines data.'),
  shipping_lines: z
    .array(AdminOrderShippingLineSchema)
    .describe('Shipping lines data.'),
  fee_lines: z.array(AdminOrderFeeLineSchema).describe('Fee lines data.'),
  coupon_lines: z
    .array(AdminOrderCouponLineSchema)
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
 * Order request parameters for POST /orders (create). WooCommerce accepts
 * an empty body to create a draft order, so all fields are optional.
 */
export const AdminOrderCreateRequestSchema = z.looseObject({
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
  billing: AdminOrderAddress.optional(),
  shipping: AdminOrderAddress.omit({ email: true, phone: true }).optional(),
  payment_method: z.string().optional(),
  payment_method_title: z.string().optional(),
  transaction_id: z.string().optional(),
  meta_data: z.array(AdminOrderMetaData).optional(),
  line_items: z.array(AdminOrderLineItemSchema.partial()).optional(),
  shipping_lines: z.array(AdminOrderShippingLineSchema.partial()).optional(),
  fee_lines: z.array(AdminOrderFeeLineSchema.partial()).optional(),
  coupon_lines: z.array(AdminOrderCouponLineSchema.partial()).optional(),
  set_paid: z.boolean().optional(),
});

export type AdminOrderCreateRequest = z.input<
  typeof AdminOrderCreateRequestSchema
>;

/**
 * Order request parameters for PUT /orders/{id} (update).
 */
export const AdminOrderUpdateRequestSchema = z.looseObject({
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
  billing: AdminOrderAddress.optional(),
  shipping: AdminOrderAddress.omit({ email: true, phone: true }).optional(),
  payment_method: z.string().optional(),
  payment_method_title: z.string().optional(),
  transaction_id: z.string().optional(),
  meta_data: z.array(AdminOrderMetaData).optional(),
  line_items: z.array(AdminOrderLineItemSchema.partial()).optional(),
  shipping_lines: z.array(AdminOrderShippingLineSchema.partial()).optional(),
  fee_lines: z.array(AdminOrderFeeLineSchema.partial()).optional(),
  coupon_lines: z.array(AdminOrderCouponLineSchema.partial()).optional(),
  set_paid: z.boolean().optional(),
});

export type AdminOrderUpdateRequest = z.input<
  typeof AdminOrderUpdateRequestSchema
>;

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
  id: z.number().describe('Unique identifier for the resource.'),
  author: z.string().describe('Order note author.'),
  date_created: z
    .string()
    .describe("The date the order note was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the order note was created, as GMT.'),
  note: z.string().describe('Order note content.'),
  customer_note: z
    .boolean()
    .describe(
      'If true, the note will be shown to customers and they will be notified. If false, the note will be for admin reference only.'
    ),
  added_by_user: z
    .boolean()
    .describe(
      'If true, this note will be attributed to the current user. If false, the note will be attributed to the system.'
    ),
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
 * Order note request parameters for POST /orders/{id}/notes (create).
 * WooCommerce order notes are append-only — no update endpoint exists.
 */
export const AdminOrderNoteCreateRequestSchema = z.looseObject({
  note: z.string().describe('Order note content.'),
  customer_note: z.boolean().optional(),
  added_by_user: z.boolean().optional(),
});

export type AdminOrderNoteCreateRequest = z.input<
  typeof AdminOrderNoteCreateRequestSchema
>;

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

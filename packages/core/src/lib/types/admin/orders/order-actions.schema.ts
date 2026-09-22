import { z } from 'zod';

/**
 * Order receipt generation request
 */
export const AdminOrderReceiptRequestSchema = z.looseObject({
  expiration_date: z
    .string()
    .optional()
    .describe('Expiration date formatted as yyyy-mm-dd.'),
  expiration_days: z
    .number()
    .default(1)
    .optional()
    .describe(
      'Number of days to be added to the current date to get the expiration date.'
    ),
  force_new: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'True to force the creation of a new receipt even if one already exists and has not expired yet.'
    ),
});

export type AdminOrderReceiptRequest = z.input<
  typeof AdminOrderReceiptRequestSchema
>;

/**
 * Order receipt response
 */
export const AdminOrderReceiptSchema = z.looseObject({
  receipt_url: z.string().describe('Public URL of the receipt.'),
  expiration_date: z
    .string()
    .describe('Expiration date of the receipt, formatted as yyyy-mm-dd.'),
});

export type AdminOrderReceipt = z.infer<typeof AdminOrderReceiptSchema>;

/**
 * Email template for orders
 */
export const AdminOrderEmailTemplateSchema = z.looseObject({
  /** Core template IDs are listed in {@link AdminOrderEmailTemplateId}; extensions can add more. */
  id: z
    .string()
    .optional()
    .describe('A unique ID string for the email template.'),
  title: z
    .string()
    .optional()
    .describe('The display name of the email template.'),
  description: z
    .string()
    .optional()
    .describe('A description of the purpose of the email template.'),
});

export type AdminOrderEmailTemplate = z.infer<
  typeof AdminOrderEmailTemplateSchema
>;

/**
 * IDs of the email templates WooCommerce core registers. Extensions can add
 * more, so request and response fields accept any string.
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
  'admin_payment_gateway_enabled',
]);

export type AdminOrderEmailTemplateId = z.infer<
  typeof AdminOrderEmailTemplateIdSchema
>;

/**
 * Send order email request
 */
export const AdminOrderSendEmailRequestSchema = z.looseObject({
  email: z
    .string()
    .optional()
    .describe('Email address to send the order details to.'),
  force_email_update: z
    .boolean()
    .optional()
    .describe(
      'Whether to update the billing email of the order, even if it already has one.'
    ),
  template_id: z
    .string()
    .optional()
    .describe(
      'The email template to use. If omitted, the best template is auto-selected based on order status.'
    ),
});

export type AdminOrderSendEmailRequest = Omit<
  z.input<typeof AdminOrderSendEmailRequestSchema>,
  'template_id'
> & {
  /** The email template to use. If omitted, the best template is auto-selected based on order status. */
  template_id?: AdminOrderEmailTemplateId | (string & {});
};

/**
 * Send order details request
 */
export const AdminOrderSendDetailsRequestSchema = z.looseObject({
  email: z
    .string()
    .optional()
    .describe('Email address to send the order details to.'),
  force_email_update: z
    .boolean()
    .optional()
    .describe(
      'Whether to update the billing email of the order, even if it already has one.'
    ),
});

export type AdminOrderSendDetailsRequest = z.input<
  typeof AdminOrderSendDetailsRequestSchema
>;

/**
 * Response of the `send_email` and `send_order_details` order actions
 */
export const AdminOrderActionResultSchema = z.looseObject({
  message: z
    .string()
    .optional()
    .describe('A message indicating that the action completed successfully.'),
});

export type AdminOrderActionResult = z.infer<
  typeof AdminOrderActionResultSchema
>;

/**
 * Order status information
 */
export const AdminOrderStatusInfoSchema = z.looseObject({
  slug: z.string().describe('Order status slug.'),
  name: z.string().describe('Order status name.'),
});

export type AdminOrderStatusInfo = z.infer<typeof AdminOrderStatusInfoSchema>;

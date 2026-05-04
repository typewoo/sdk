import { z } from 'zod';

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

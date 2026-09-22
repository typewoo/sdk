import { z } from 'zod';
import {
  AdminOrderFeeLineSchema,
  AdminOrderLineItemSchema,
  AdminOrderShippingLineSchema,
  AdminOrderTaxLineSchema,
} from '../orders/order.schema.js';
import { AdminRefundMetaData } from './refund.js';

// WooCommerce builds refund items with the same code as order items, so the
// refund line schemas reuse the order ones. Refunded quantities and totals
// are negative.

/** Line item in a refund. */
export const AdminRefundLineItemSchema = AdminOrderLineItemSchema;

export type AdminRefundLineItem = z.infer<typeof AdminRefundLineItemSchema>;

/** Shipping line in a refund. */
export const AdminRefundShippingLineSchema = AdminOrderShippingLineSchema;

export type AdminRefundShippingLine = z.infer<
  typeof AdminRefundShippingLineSchema
>;

/** Tax line in a refund. */
export const AdminRefundTaxLineSchema = AdminOrderTaxLineSchema;

export type AdminRefundTaxLine = z.infer<typeof AdminRefundTaxLineSchema>;

/** Fee line in a refund. */
export const AdminRefundFeeLineSchema = AdminOrderFeeLineSchema;

export type AdminRefundFeeLine = z.infer<typeof AdminRefundFeeLineSchema>;

export const AdminRefundSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  parent_id: z
    .number()
    .optional()
    .describe(
      'Parent order ID. Only returned by `/refunds`, not by the order-scoped routes.'
    ),
  date_created: z
    .string()
    .describe("The date the order refund was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the order refund was created, as GMT.'),
  amount: z.string().optional().describe('Refund amount.'),
  reason: z.string().optional().describe('Reason for refund.'),
  refunded_by: z
    .number()
    .optional()
    .describe('User ID of user who created the refund.'),
  refunded_payment: z
    .boolean()
    .describe('If the payment was refunded via the API.'),
  meta_data: z.array(AdminRefundMetaData).optional().describe('Meta data.'),
  line_items: z
    .array(AdminRefundLineItemSchema)
    .optional()
    .describe('Line items data.'),
  shipping_lines: z
    .array(AdminRefundShippingLineSchema)
    .optional()
    .describe('Shipping lines data.'),
  tax_lines: z.array(AdminRefundTaxLineSchema).describe('Tax lines data.'),
  fee_lines: z
    .array(AdminRefundFeeLineSchema)
    .optional()
    .describe('Fee lines data.'),
  api_refund: z
    .boolean()
    .default(true)
    .optional()
    .describe(
      'When true, the payment gateway API is used to generate the refund.'
    ),
  api_restock: z
    .boolean()
    .default(true)
    .optional()
    .describe('When true, refunded items are restocked.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminRefund = z.infer<typeof AdminRefundSchema>;

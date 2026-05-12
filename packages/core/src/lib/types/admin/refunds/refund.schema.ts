import { z } from 'zod';
import { AdminRefundMetaData } from './refund.js';

export const AdminRefundLineItemSchema = z.looseObject({
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
  meta_data: z.array(AdminRefundMetaData),
  sku: z.string(),
  price: z.number(),
});

export type AdminRefundLineItem = z.infer<typeof AdminRefundLineItemSchema>;

export const AdminRefundShippingLineSchema = z.looseObject({
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
  meta_data: z.array(AdminRefundMetaData),
});

export type AdminRefundShippingLine = z.infer<
  typeof AdminRefundShippingLineSchema
>;

export const AdminRefundTaxLineSchema = z.looseObject({
  id: z.number(),
  rate_code: z.string(),
  rate_id: z.number(),
  label: z.string(),
  compound: z.boolean(),
  tax_total: z.string(),
  shipping_tax_total: z.string(),
  rate_percent: z.number(),
  meta_data: z.array(AdminRefundMetaData),
});

export type AdminRefundTaxLine = z.infer<typeof AdminRefundTaxLineSchema>;

export const AdminRefundFeeLineSchema = z.looseObject({
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
  meta_data: z.array(AdminRefundMetaData),
});

export type AdminRefundFeeLine = z.infer<typeof AdminRefundFeeLineSchema>;

export const AdminRefundSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
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

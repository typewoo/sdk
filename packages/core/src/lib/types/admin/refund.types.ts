import { z } from 'zod';

const AdminRefundMetaData = z.object({
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
  date_created: z.string().describe('The date the order refund was created, in the site\'s timezone.'),
  date_created_gmt: z.string().describe('The date the order refund was created, as GMT.'),
  amount: z.string().describe('Refund amount.'),
  reason: z.string().describe('Reason for refund.'),
  refunded_by: z.number().describe('User ID of user who created the refund.'),
  refunded_payment: z.boolean().describe('If the payment was refunded via the API.'),
  meta_data: z.array(AdminRefundMetaData).describe('Meta data.'),
  line_items: z.array(AdminRefundLineItemSchema).describe('Line items data.'),
  shipping_lines: z.array(AdminRefundShippingLineSchema).describe('Shipping lines data.'),
  tax_lines: z.array(AdminRefundTaxLineSchema).describe('Tax lines data.'),
  fee_lines: z.array(AdminRefundFeeLineSchema).describe('Fee lines data.'),
  api_refund: z.boolean().describe('When true, the payment gateway API is used to generate the refund.'),
  api_restock: z.boolean().describe('When true, refunded items are restocked.'),
  order_id: z.number(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminRefund = z.infer<typeof AdminRefundSchema>;

export const AdminRefundQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
    .optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
  dp: z.number().optional(),
});

export type AdminRefundQueryParams = z.infer<
  typeof AdminRefundQueryParamsSchema
>;

/**
 * Request payload for creating a refund for a specific order
 * Follows WooCommerce /wc/v3/orders/{orderId}/refunds POST args.
 * Note: line_items/shipping_lines/tax_lines/fee_lines shapes vary; use loose records.
 */
export const AdminRefundCreateRequestSchema = z.looseObject({
  amount: z.string(),
  reason: z.string().optional(),
  refunded_by: z.number().optional(),
  refunded_payment: z.boolean().optional(),
  api_refund: z.boolean().optional(),
  api_restock: z.boolean().optional(),
  line_items: z.array(z.record(z.string(), z.unknown())).optional(),
  shipping_lines: z.array(z.record(z.string(), z.unknown())).optional(),
  tax_lines: z.array(z.record(z.string(), z.unknown())).optional(),
  fee_lines: z.array(z.record(z.string(), z.unknown())).optional(),
});

export type AdminRefundCreateRequest = z.infer<
  typeof AdminRefundCreateRequestSchema
>;

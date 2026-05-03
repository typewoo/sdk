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
  date_created: z
    .string()
    .describe("The date the order refund was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the order refund was created, as GMT.'),
  amount: z.string().describe('Refund amount.'),
  reason: z.string().describe('Reason for refund.'),
  refunded_by: z.number().describe('User ID of user who created the refund.'),
  refunded_payment: z
    .boolean()
    .describe('If the payment was refunded via the API.'),
  meta_data: z.array(AdminRefundMetaData).describe('Meta data.'),
  line_items: z.array(AdminRefundLineItemSchema).describe('Line items data.'),
  shipping_lines: z
    .array(AdminRefundShippingLineSchema)
    .describe('Shipping lines data.'),
  tax_lines: z.array(AdminRefundTaxLineSchema).describe('Tax lines data.'),
  fee_lines: z.array(AdminRefundFeeLineSchema).describe('Fee lines data.'),
  api_refund: z
    .boolean()
    .describe(
      'When true, the payment gateway API is used to generate the refund.'
    ),
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
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  exclude: z
    .array(z.number())
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .optional()
    .describe('Limit result set to specific ids.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
    .optional()
    .describe('Sort collection by object attribute.'),
  parent: z
    .array(z.number())
    .optional()
    .describe('Limit result set to those of particular parent IDs.'),
  parent_exclude: z
    .array(z.number())
    .optional()
    .describe(
      'Limit result set to all items except those of a particular parent ID.'
    ),
  dp: z
    .number()
    .optional()
    .describe('Number of decimal points to use in each resource.'),
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
  amount: z.string().describe('Refund amount.'),
  reason: z.string().optional().describe('Reason for refund.'),
  refunded_by: z
    .number()
    .optional()
    .describe('User ID of user who created the refund.'),
  refunded_payment: z.boolean().optional(),
  api_refund: z
    .boolean()
    .optional()
    .describe(
      'When true, the payment gateway API is used to generate the refund.'
    ),
  api_restock: z
    .boolean()
    .optional()
    .describe('When true, refunded items are restocked.'),
  line_items: z.array(z.record(z.string(), z.unknown())).optional(),
  shipping_lines: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Shipping lines data.'),
  tax_lines: z.array(z.record(z.string(), z.unknown())).optional(),
  fee_lines: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Fee lines data.'),
});

export type AdminRefundCreateRequest = z.infer<
  typeof AdminRefundCreateRequestSchema
>;

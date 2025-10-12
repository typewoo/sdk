import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AdminMetaData } from './common.types.js';

export const AdminRefundLineItemSchema = z.object({
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
  price: z.number(),
});

export type AdminRefundLineItem = z.infer<typeof AdminRefundLineItemSchema>;
export class ApiAdminRefundLineItem extends createZodDto(
  AdminRefundLineItemSchema
) {}

export const AdminRefundShippingLineSchema = z.object({
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

export type AdminRefundShippingLine = z.infer<
  typeof AdminRefundShippingLineSchema
>;
export class ApiAdminRefundShippingLine extends createZodDto(
  AdminRefundShippingLineSchema
) {}

export const AdminRefundTaxLineSchema = z.object({
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

export type AdminRefundTaxLine = z.infer<typeof AdminRefundTaxLineSchema>;
export class ApiAdminRefundTaxLine extends createZodDto(
  AdminRefundTaxLineSchema
) {}

export const AdminRefundFeeLineSchema = z.object({
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

export type AdminRefundFeeLine = z.infer<typeof AdminRefundFeeLineSchema>;
export class ApiAdminRefundFeeLine extends createZodDto(
  AdminRefundFeeLineSchema
) {}

export const AdminRefundSchema = z.object({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  amount: z.string(),
  reason: z.string(),
  refunded_by: z.number(),
  refunded_payment: z.boolean(),
  meta_data: z.array(AdminMetaData),
  line_items: z.array(AdminRefundLineItemSchema),
  shipping_lines: z.array(AdminRefundShippingLineSchema),
  tax_lines: z.array(AdminRefundTaxLineSchema),
  fee_lines: z.array(AdminRefundFeeLineSchema),
  api_refund: z.boolean(),
  api_restock: z.boolean(),
  order_id: z.number(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminRefund = z.infer<typeof AdminRefundSchema>;
export class ApiAdminRefund extends createZodDto(AdminRefundSchema) {}

export const AdminRefundQueryParamsSchema = z.object({
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
export class ApiAdminRefundQueryParams extends createZodDto(
  AdminRefundQueryParamsSchema
) {}

/**
 * Request payload for creating a refund for a specific order
 * Follows WooCommerce /wc/v3/orders/{orderId}/refunds POST args.
 * Note: line_items/shipping_lines/tax_lines/fee_lines shapes vary; use loose records.
 */
export const AdminRefundCreateRequestSchema = z.object({
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
export class ApiAdminRefundCreateRequest extends createZodDto(
  AdminRefundCreateRequestSchema
) {}

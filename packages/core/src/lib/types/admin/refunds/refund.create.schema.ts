import { z } from 'zod';
import { AdminMetaDataInputSchema } from '../meta-data.schema.js';

/**
 * An order item to refund. `id` is the ID of the order's line, shipping or
 * fee item; WooCommerce sums `refund_total` and `refund_tax` into the refund
 * amount when `amount` is omitted.
 */
export const AdminRefundCreateLineItemSchema = z.looseObject({
  id: z
    .number()
    .describe('ID of the order item (line, shipping or fee) to refund.'),
  quantity: z
    .number()
    .optional()
    .describe('Quantity to refund. Restocked when `api_restock` is true.'),
  refund_total: z
    .union([z.number(), z.string()])
    .optional()
    .describe('Amount to refund for this item, excluding taxes.'),
  refund_tax: z
    .array(
      z.object({
        id: z.number().describe('Tax rate ID.'),
        refund_total: z
          .union([z.number(), z.string()])
          .describe('Amount to refund for this tax.'),
      })
    )
    .optional()
    .describe('Taxes to refund for this item.'),
});

export type AdminRefundCreateLineItem = z.input<
  typeof AdminRefundCreateLineItemSchema
>;

const IGNORED_LINES_NOTE =
  "Listed in WooCommerce's schema but ignored when creating a refund; refund shipping and fee items through `line_items` using their item id.";

const AdminRefundCreateMetaSchema = z.object({
  key: z.string().optional().describe('Meta key.'),
  value: z.unknown().optional().describe('Meta value.'),
});

/**
 * Request payload for creating a refund for a specific order
 * Follows WooCommerce /wc/v3/orders/{orderId}/refunds POST args.
 */
export const AdminRefundCreateRequestSchema = z.looseObject({
  amount: z
    .string()
    .optional()
    .describe(
      'Refund amount. Calculated from `line_items` when omitted and every item has a `refund_total`.'
    ),
  reason: z.string().optional().describe('Reason for refund.'),
  refunded_by: z
    .number()
    .optional()
    .describe('User ID of user who created the refund.'),
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
  line_items: z
    .array(AdminRefundCreateLineItemSchema)
    .optional()
    .describe('Order items (line, shipping or fee) to refund.'),
  shipping_lines: z
    .array(
      z.looseObject({
        method_title: z
          .string()
          .nullable()
          .optional()
          .describe('Shipping method name.'),
        method_id: z
          .string()
          .nullable()
          .optional()
          .describe('Shipping method ID.'),
        instance_id: z.string().optional().describe('Shipping instance ID.'),
        total: z.string().optional().describe('Line total (after discounts).'),
        meta_data: z
          .array(AdminRefundCreateMetaSchema)
          .optional()
          .describe('Meta data.'),
      })
    )
    .optional()
    .describe(`Shipping lines data. ${IGNORED_LINES_NOTE}`),
  fee_lines: z
    .array(
      z.looseObject({
        name: z.string().nullable().optional().describe('Fee name.'),
        tax_class: z.string().optional().describe('Tax class of fee.'),
        tax_status: z
          .enum(['taxable', 'none'])
          .optional()
          .describe('Tax status of fee.'),
        total: z.string().optional().describe('Line total (after discounts).'),
        meta_data: z
          .array(AdminRefundCreateMetaSchema)
          .optional()
          .describe('Meta data.'),
      })
    )
    .optional()
    .describe(`Fee lines data. ${IGNORED_LINES_NOTE}`),
  meta_data: z
    .array(AdminMetaDataInputSchema)
    .optional()
    .describe('Meta data.'),
  order_id: z.number().optional().describe('The order ID.'),
});

export type AdminRefundCreateRequest = z.input<
  typeof AdminRefundCreateRequestSchema
>;

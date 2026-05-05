import { z } from 'zod';

/**
 * Request payload for creating a refund for a specific order
 * Follows WooCommerce /wc/v3/orders/{orderId}/refunds POST args.
 * Note: line_items/shipping_lines/tax_lines/fee_lines shapes vary; use loose records.
 */
export const AdminRefundCreateRequestSchema = z.looseObject({
  amount: z.string().optional().describe('Refund amount.'),
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
  shipping_lines: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Shipping lines data.'),
  fee_lines: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Fee lines data.'),
  meta_data: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Meta data.'),
  order_id: z.number().optional().describe('The order ID.'),
});

export type AdminRefundCreateRequest = z.infer<
  typeof AdminRefundCreateRequestSchema
>;

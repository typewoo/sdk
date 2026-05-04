import { z } from 'zod';

export const OrderTotalResponseSchema = z.looseObject({
  subtotal: z.string().describe('Subtotal of the order.'),
  total_discount: z.string().describe('Total discount from applied coupons.'),
  total_shipping: z.string().nullable().describe('Total price of shipping.'),
  total_fees: z.string().describe('Total price of any applied fees.'),
  total_tax: z.string().describe('Total tax applied to the order.'),
  total_refund: z.string().describe('Total refund applied to the order.'),
  total_price: z.string().describe('Total price the customer will pay.'),
  total_items: z.string().describe('Total price of items in the order.'),
  total_items_tax: z.string().describe('Total tax on items in the order.'),
  total_fees_tax: z.string().describe('Total tax on fees.'),
  total_discount_tax: z
    .string()
    .describe('Total tax removed due to discount from applied coupons.'),
  total_shipping_tax: z
    .string()
    .nullable()
    .describe(
      'Total tax on shipping. If shipping has not been calculated, a null is returned.'
    ),
  tax_lines: z
    .array(z.unknown())
    .describe('Lines of taxes applied to items and shipping.'),
});

export type OrderTotalResponse = z.infer<typeof OrderTotalResponseSchema>;

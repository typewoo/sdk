import { z } from 'zod';

export const OrderTotalResponseSchema = z.looseObject({
  subtotal: z.string(),
  total_discount: z.string(),
  total_shipping: z.string(),
  total_fees: z.string(),
  total_tax: z.string(),
  total_refund: z.string(),
  total_price: z.string(),
  total_items: z.string(),
  total_items_tax: z.string(),
  total_fees_tax: z.string(),
  total_discount_tax: z.string(),
  total_shipping_tax: z.string(),
  tax_lines: z.array(z.unknown()),
});

export type OrderTotalResponse = z.infer<typeof OrderTotalResponseSchema>;

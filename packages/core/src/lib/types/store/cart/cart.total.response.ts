import { z } from 'zod';

export const CartTotalResponseSchema = z.looseObject({
  total_items: z.string(),
  total_items_tax: z.string(),
  total_fees: z.string(),
  total_fees_tax: z.string(),
  total_discount: z.string(),
  total_discount_tax: z.string(),
  total_shipping: z.string(),
  total_shipping_tax: z.string(),
  total_price: z.string(),
  total_tax: z.string(),
  tax_lines: z.array(
    z.looseObject({
      name: z.string(),
      price: z.string(),
      rate: z.string(),
    }),
  ),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

export type CartTotalResponse = z.infer<typeof CartTotalResponseSchema>;

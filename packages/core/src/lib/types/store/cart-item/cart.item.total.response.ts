import { z } from 'zod';

export const CartItemTotalResponseSchema = z.looseObject({
  line_subtotal: z.string(),
  line_subtotal_tax: z.string(),
  line_total: z.string(),
  line_total_tax: z.string(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

export type CartItemTotalResponse = z.infer<typeof CartItemTotalResponseSchema>;

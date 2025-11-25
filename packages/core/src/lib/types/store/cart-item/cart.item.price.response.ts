import { z } from 'zod';

export const CartItemPriceResponseSchema = z.object({
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  price_range: z.unknown().nullable(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
  raw_prices: z.object({
    precision: z.number(),
    price: z.string(),
    regular_price: z.string(),
    sale_price: z.string(),
  }),
});

export type CartItemPriceResponse = z.infer<typeof CartItemPriceResponseSchema>;

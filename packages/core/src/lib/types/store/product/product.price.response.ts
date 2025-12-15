import { z } from 'zod';

export const ProductPriceResponseSchema = z.looseObject({
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  price_range: z.unknown(),
});

export type ProductPriceResponse = z.infer<typeof ProductPriceResponseSchema>;

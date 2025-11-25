import { z } from 'zod';

export const ProductCollectionDataPriceRangeResponseSchema = z.object({
  min_price: z.string(),
  max_price: z.string(),
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
});

export type ProductCollectionDataPriceRangeResponse = z.infer<
  typeof ProductCollectionDataPriceRangeResponseSchema
>;

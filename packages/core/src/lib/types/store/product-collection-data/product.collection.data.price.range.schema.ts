import { z } from 'zod';

export const ProductCollectionDataPriceRangeResponseSchema = z.looseObject({
  min_price: z.string().describe('Min price found in collection of products.'),
  max_price: z.string().describe('Max price found in collection of products.'),
  currency_code: z
    .string()
    .describe('Currency code (in ISO format) for returned prices.'),
  currency_symbol: z
    .string()
    .describe(
      'Currency symbol for the currency which can be used to format returned prices.'
    ),
  currency_minor_unit: z
    .number()
    .describe(
      'Currency minor unit (number of digits after the decimal separator) for returned prices.'
    ),
  currency_decimal_separator: z
    .string()
    .describe(
      'Decimal separator for the currency which can be used to format returned prices.'
    ),
  currency_thousand_separator: z
    .string()
    .describe(
      'Thousand separator for the currency which can be used to format returned prices.'
    ),
  currency_prefix: z
    .string()
    .describe(
      'Price prefix for the currency which can be used to format returned prices.'
    ),
  currency_suffix: z
    .string()
    .describe(
      'Price prefix for the currency which can be used to format returned prices.'
    ),
});

export type ProductCollectionDataPriceRangeResponse = z.infer<
  typeof ProductCollectionDataPriceRangeResponseSchema
>;

import { z } from 'zod';

export const ProductPriceRangeResponseSchema = z.looseObject({
  min_amount: z.string(),
  max_amount: z.string(),
});

export type ProductPriceRangeResponse = z.infer<
  typeof ProductPriceRangeResponseSchema
>;

export const ProductPriceResponseSchema = z.looseObject({
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
      'Currency minor unit (number of digits after the decimal separator).'
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
  price: z.string().describe('Current product price.'),
  regular_price: z.string().describe('Regular product price.'),
  sale_price: z.string().describe('Sale product price, if applicable.'),
  price_range: ProductPriceRangeResponseSchema.nullish().describe(
    'Price range, if applicable.'
  ),
});

export type ProductPriceResponse = z.infer<typeof ProductPriceResponseSchema>;

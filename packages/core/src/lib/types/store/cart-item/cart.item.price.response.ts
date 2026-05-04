import { z } from 'zod';

export const CartItemPriceResponseSchema = z.looseObject({
  price: z.string().describe('Current product price.'),
  regular_price: z.string().describe('Regular product price.'),
  sale_price: z.string().describe('Sale product price, if applicable.'),
  price_range: z
    .union([z.unknown(), z.null()])
    .describe('Price range, if applicable.'),
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
  raw_prices: z
    .looseObject({
      precision: z.number(),
      price: z.string(),
      regular_price: z.string(),
      sale_price: z.string(),
    })
    .nullable()
    .describe(
      'Raw unrounded product prices used in calculations. Provided using a precision value and amount.'
    ),
});

export type CartItemPriceResponse = z.infer<typeof CartItemPriceResponseSchema>;

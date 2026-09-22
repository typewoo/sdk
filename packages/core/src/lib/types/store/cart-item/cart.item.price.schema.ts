import { z } from 'zod';

export const CartItemPriceResponseSchema = z.looseObject({
  price: z.string().describe('Current product price.'),
  regular_price: z.string().describe('Regular product price.'),
  sale_price: z.string().describe('Sale product price, if applicable.'),
  price_range: z
    .looseObject({
      min_amount: z.string().optional().describe('Price amount.'),
      max_amount: z.string().optional().describe('Price amount.'),
    })
    .nullable()
    .optional()
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
  raw_prices: z
    .looseObject({
      precision: z
        .number()
        .optional()
        .describe('Decimal precision of the returned prices.'),
      price: z.string().optional().describe('Current product price.'),
      regular_price: z.string().optional().describe('Regular product price.'),
      sale_price: z
        .string()
        .optional()
        .describe('Sale product price, if applicable.'),
    })
    .nullable()
    .optional()
    .describe(
      'Raw unrounded product prices used in calculations. Provided using a higher unit of precision than the currency.'
    ),
});

export type CartItemPriceResponse = z.infer<typeof CartItemPriceResponseSchema>;

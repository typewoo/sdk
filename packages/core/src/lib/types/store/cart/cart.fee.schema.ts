import { z } from 'zod';

export const CartFeeTotalsResponseSchema = z.looseObject({
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
      'Price suffix for the currency which can be used to format returned prices.'
    ),
  total: z.string().describe('Total amount for this fee.'),
  total_tax: z.string().describe('Total tax amount for this fee.'),
});
export type CartFeeTotalsResponse = z.infer<typeof CartFeeTotalsResponseSchema>;

export const CartFeeResponseSchema = z.looseObject({
  id: z.string().describe('Unique identifier for the fee within the cart.'),
  name: z.string().describe('Fee name.'),
  totals: CartFeeTotalsResponseSchema.describe(
    'Fee total amounts provided using the smallest unit of the currency.'
  ),
});
export type CartFeeResponse = z.infer<typeof CartFeeResponseSchema>;

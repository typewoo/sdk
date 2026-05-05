import { z } from 'zod';

export const CartItemTotalResponseSchema = z.looseObject({
  line_subtotal: z
    .string()
    .describe(
      'Line subtotal (the price of the product before coupon discounts have been applied).'
    ),
  line_subtotal_tax: z.string().describe('Line subtotal tax.'),
  line_total: z
    .string()
    .describe(
      'Line total (the price of the product after coupon discounts have been applied).'
    ),
  line_total_tax: z.string().describe('Line total tax.'),
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

export type CartItemTotalResponse = z.infer<typeof CartItemTotalResponseSchema>;

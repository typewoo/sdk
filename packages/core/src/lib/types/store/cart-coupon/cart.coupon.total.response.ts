import { z } from 'zod';

export const CartCouponTotalResponseSchema = z.looseObject({
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
  total_discount: z.string().describe('Total discount applied by this coupon.'),
  total_discount_tax: z
    .string()
    .describe('Total tax removed due to discount applied by this coupon.'),
});

export type CartCouponTotalResponse = z.infer<
  typeof CartCouponTotalResponseSchema
>;

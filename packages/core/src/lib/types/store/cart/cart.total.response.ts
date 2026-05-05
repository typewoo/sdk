import { z } from 'zod';

export const CartTotalResponseSchema = z.looseObject({
  total_items: z.string().describe('Total price of items in the cart.'),
  total_items_tax: z.string().describe('Total tax on items in the cart.'),
  total_fees: z.string().describe('Total price of any applied fees.'),
  total_fees_tax: z.string().describe('Total tax on fees.'),
  total_discount: z.string().describe('Total discount from applied coupons.'),
  total_discount_tax: z
    .string()
    .describe('Total tax removed due to discount from applied coupons.'),
  total_shipping: z
    .string()
    .nullable()
    .describe(
      'Total price of shipping. If shipping has not been calculated, a null response will be sent.'
    ),
  total_shipping_tax: z
    .string()
    .nullable()
    .describe(
      'Total tax on shipping. If shipping has not been calculated, a null response will be sent.'
    ),
  total_price: z.string().describe('Total price the customer will pay.'),
  total_tax: z.string().describe('Total tax applied to items and shipping.'),
  tax_lines: z
    .array(
      z.looseObject({
        name: z.string(),
        price: z.string(),
        rate: z.string(),
      })
    )
    .describe('Lines of taxes applied to items and shipping.'),
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

export type CartTotalResponse = z.infer<typeof CartTotalResponseSchema>;

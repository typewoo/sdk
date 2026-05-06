import { z } from 'zod';

export const OrderTotalResponseSchema = z.looseObject({
  subtotal: z.string().describe('Subtotal of the order.'),
  total_discount: z.string().describe('Total discount from applied coupons.'),
  total_shipping: z.string().nullable().describe('Total price of shipping.'),
  total_fees: z.string().describe('Total price of any applied fees.'),
  total_tax: z.string().describe('Total tax applied to the order.'),
  total_refund: z.string().describe('Total refund applied to the order.'),
  total_price: z.string().describe('Total price the customer will pay.'),
  total_items: z.string().describe('Total price of items in the order.'),
  total_items_tax: z.string().describe('Total tax on items in the order.'),
  total_fees_tax: z.string().describe('Total tax on fees.'),
  total_discount_tax: z
    .string()
    .describe('Total tax removed due to discount from applied coupons.'),
  total_shipping_tax: z
    .string()
    .nullable()
    .describe(
      'Total tax on shipping. If shipping has not been calculated, a null response will be sent.'
    ),
  tax_lines: z
    .array(z.unknown())
    .describe('Lines of taxes applied to items and shipping.'),
  currency_code: z
    .string()
    .optional()
    .describe('Currency code (in ISO format) for returned prices.'),
  currency_symbol: z
    .string()
    .optional()
    .describe(
      'Currency symbol for the currency which can be used to format returned prices.'
    ),
  currency_minor_unit: z
    .number()
    .optional()
    .describe(
      'Currency minor unit (number of digits after the decimal separator) for returned prices.'
    ),
  currency_decimal_separator: z
    .string()
    .optional()
    .describe(
      'Decimal separator for the currency which can be used to format returned prices.'
    ),
  currency_thousand_separator: z
    .string()
    .optional()
    .describe(
      'Thousand separator for the currency which can be used to format returned prices.'
    ),
  currency_prefix: z
    .string()
    .optional()
    .describe(
      'Price prefix for the currency which can be used to format returned prices.'
    ),
  currency_suffix: z
    .string()
    .optional()
    .describe(
      'Price prefix for the currency which can be used to format returned prices.'
    ),
});

export type OrderTotalResponse = z.infer<typeof OrderTotalResponseSchema>;

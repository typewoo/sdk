import { z } from 'zod';
import { CartCouponResponseSchema } from '../cart-coupon/cart.coupon.response.js';
import { CartItemResponseSchema } from '../cart-item/cart.item.response.js';
import { CartBillingResponseSchema } from './cart.billing.response.js';
import { CartShippingRateResponseSchema } from './cart.shipping.rate.response.js';
import { CartShippingResponseSchema } from './cart.shipping.response.js';
import { CartTotalResponseSchema } from './cart.total.response.js';
import { ProductResponseSchema } from '../product/product.response.js';

export const CartErrorResponseSchema = z.looseObject({
  code: z.string(),
  message: z.string(),
});

export type CartErrorResponse = z.infer<typeof CartErrorResponseSchema>;

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

export const CartResponseSchema = z.looseObject({
  items: z.array(CartItemResponseSchema).describe('List of cart items.'),
  coupons: z
    .array(CartCouponResponseSchema)
    .describe('List of applied cart coupons.'),
  fees: z.array(CartFeeResponseSchema).describe('List of cart fees.'),
  totals: CartTotalResponseSchema.describe(
    'Cart total amounts provided using the smallest unit of the currency.'
  ),
  shipping_address: CartShippingResponseSchema.describe(
    'Current set shipping address for the customer.'
  ),
  billing_address: CartBillingResponseSchema.describe(
    'Current set billing address for the customer.'
  ),
  needs_payment: z
    .boolean()
    .describe(
      'True if the cart needs payment. False for carts with only free products and no shipping costs.'
    ),
  needs_shipping: z
    .boolean()
    .describe(
      'True if the cart needs shipping. False for carts with only digital goods or stores with no shipping methods set-up.'
    ),
  payment_requirements: z
    .array(z.string())
    .describe(
      'List of required payment gateway features to process the order.'
    ),
  has_calculated_shipping: z
    .boolean()
    .describe(
      'True if the cart meets the criteria for showing shipping costs, and rates have been calculated and included in the totals.'
    ),
  shipping_rates: z
    .array(CartShippingRateResponseSchema)
    .describe('List of available shipping rates for the cart.'),
  items_count: z.number().describe('Number of items in the cart.'),
  items_weight: z
    .number()
    .describe('Total weight (in grams) of all products in the cart.'),
  cross_sells: z
    .array(ProductResponseSchema)
    .describe('List of cross-sells items related to cart items.'),
  errors: z
    .array(CartErrorResponseSchema)
    .describe(
      'List of cart item errors, for example, items in the cart which are out of stock.'
    ),
  payment_methods: z
    .array(z.string())
    .describe(
      'List of available payment method IDs that can be used to process the order.'
    ),
  extensions: z.unknown().optional(),
});

export type CartResponse = z.infer<typeof CartResponseSchema>;

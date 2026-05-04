import { z } from 'zod';
import { CartCouponResponseSchema } from '../cart-coupon/cart.coupon.response.js';
import { CartItemResponseSchema } from '../cart-item/cart.item.response.js';
import { CartBillingResponseSchema } from './cart.billing.response.js';
import { CartShippingRateResponseSchema } from './cart.shipping.rate.response.js';
import { CartShippingResponseSchema } from './cart.shipping.response.js';
import { CartTotalResponseSchema } from './cart.total.response.js';

export const CartErrorResponseSchema = z.looseObject({
  code: z.string(),
  message: z.string(),
});

export type CartErrorResponse = z.infer<typeof CartErrorResponseSchema>;

export const CartResponseSchema = z.looseObject({
  items: z.array(CartItemResponseSchema).describe('List of cart items.'),
  coupons: z
    .array(CartCouponResponseSchema)
    .describe('List of applied cart coupons.'),
  fees: z.array(z.unknown()).describe('List of cart fees.'),
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
      'True if the cart needs shipping. False for carts with only digital products.'
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
    .array(z.unknown())
    .describe('List of cross-sells items related to cart items.'),
  errors: z
    .array(CartErrorResponseSchema)
    .describe(
      'List of cart item errors, for example, items in the cart which are no longer purchasable.'
    ),
  payment_methods: z
    .array(z.string())
    .describe(
      'List of available payment method IDs that can be used to process the current order.'
    ),
  extensions: z.unknown().optional(),
});

export type CartResponse = z.infer<typeof CartResponseSchema>;

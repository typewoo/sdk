import { z } from 'zod';
import { CartItemResponseSchema } from '../cart-item/cart.item.response.js';
import { ErrorResponseSchema } from '../error.response.js';
import { OrderBillingResponseSchema } from './order.billing.response.js';
import { OrderCouponResponseSchema } from './order.coupon.response.js';
import { OrderShippingResponseSchema } from './order.shipping.response.js';
import { OrderTotalResponseSchema } from './order.total.response.js';

export const OrderResponseSchema = z.looseObject({
  id: z.number().describe('The order ID.'),
  status: z.string().describe('Status of the order.'),
  coupons: z
    .array(OrderCouponResponseSchema)
    .describe('List of applied cart coupons.'),
  shipping_address: OrderShippingResponseSchema.describe(
    'Current set shipping address for the customer.'
  ),
  billing_address: OrderBillingResponseSchema.describe(
    'Current set billing address for the customer.'
  ),
  items: z
    .array(CartItemResponseSchema)
    .optional()
    .describe('Line items data.'),
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
  totals: OrderTotalResponseSchema.describe('Order totals.'),
  errors: z
    .array(ErrorResponseSchema)
    .describe(
      'List of cart item errors, for example, items in the cart which are out of stock.'
    ),
  payment_requirements: z
    .array(z.string())
    .describe(
      'List of required payment gateway features to process the order.'
    ),
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;

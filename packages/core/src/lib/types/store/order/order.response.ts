import { z } from 'zod';
import { CartItemResponseSchema } from '../cart-item/cart.item.response.js';
import { ErrorResponseSchema } from '../error.response.js';
import { OrderBillingResponseSchema } from './order.billing.response.js';
import { OrderCouponResponseSchema } from './order.coupon.response.js';
import { OrderShippingResponseSchema } from './order.shipping.response.js';
import { OrderTotalResponseSchema } from './order.total.response.js';

export const OrderResponseSchema = z.object({
  id: z.number(),
  status: z.string(),
  coupons: z.array(OrderCouponResponseSchema),
  shipping_address: OrderShippingResponseSchema,
  billing_address: OrderBillingResponseSchema,
  items: z.array(CartItemResponseSchema),
  needs_payment: z.boolean(),
  needs_shipping: z.boolean(),
  totals: OrderTotalResponseSchema,
  errors: z.array(ErrorResponseSchema),
  payment_requirements: z.array(z.string()),
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;

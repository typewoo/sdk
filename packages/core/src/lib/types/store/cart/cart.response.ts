import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CartCouponResponseSchema } from '../cart-coupon/cart.coupon.response.js';
import { CartItemResponseSchema } from '../cart-item/cart.item.response.js';
import { CartBillingResponseSchema } from './cart.billing.response.js';
import { CartShippingRateResponseSchema } from './cart.shipping.rate.response.js';
import { CartShippingResponseSchema } from './cart.shipping.response.js';
import { CartTotalResponseSchema } from './cart.total.response.js';

export const CartResponseSchema = z.object({
  items: z.array(CartItemResponseSchema),
  coupons: z.array(CartCouponResponseSchema),
  fees: z.array(z.unknown()),
  totals: CartTotalResponseSchema,
  shipping_address: CartShippingResponseSchema,
  billing_address: CartBillingResponseSchema,
  needs_payment: z.boolean(),
  needs_shipping: z.boolean(),
  payment_requirements: z.array(z.string()),
  has_calculated_shipping: z.boolean(),
  shipping_rates: z.array(CartShippingRateResponseSchema),
  items_count: z.number(),
  items_weight: z.number(),
  cross_sells: z.array(z.unknown()),
  errors: z.array(z.unknown()),
  payment_methods: z.array(z.string()),
  extensions: z.unknown(),
});

export type CartResponse = z.infer<typeof CartResponseSchema>;
export class ApiCartResponse extends createZodDto(CartResponseSchema) {}

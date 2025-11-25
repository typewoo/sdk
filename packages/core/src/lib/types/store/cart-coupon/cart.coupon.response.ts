import { z } from 'zod';
import { CartCouponTotalResponseSchema } from './cart.coupon.total.response.js';

export const CartCouponResponseSchema = z.object({
  code: z.string(),
  type: z.string(),
  totals: CartCouponTotalResponseSchema,
});

export type CartCouponResponse = z.infer<typeof CartCouponResponseSchema>;

import { z } from 'zod';
import { CartCouponTotalResponseSchema } from './cart.coupon.total.response.js';

export const CartCouponResponseSchema = z.looseObject({
  code: z.string().optional().describe("The coupon's unique code."),
  totals: CartCouponTotalResponseSchema.describe(
    'Total amounts provided using the smallest unit of the currency.'
  ),
});

export type CartCouponResponse = z.infer<typeof CartCouponResponseSchema>;

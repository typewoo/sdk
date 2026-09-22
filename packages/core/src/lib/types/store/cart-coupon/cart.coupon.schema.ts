import { z } from 'zod';
import { CartCouponTotalResponseSchema } from './cart.coupon.total.schema.js';

export const CartCouponResponseSchema = z.looseObject({
  code: z.string().optional().describe("The coupon's unique code."),
  totals: CartCouponTotalResponseSchema.describe(
    'Total amounts provided using the smallest unit of the currency.'
  ),
  discount_type: z
    .string()
    .optional()
    .describe(
      'The discount type for the coupon (e.g. percentage or fixed amount)'
    ),
});

export type CartCouponResponse = z.infer<typeof CartCouponResponseSchema>;

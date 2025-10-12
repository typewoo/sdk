import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CartCouponTotalResponseSchema = z.object({
  currency_code: z.string(),
  currency_symbol: z.string(),
  currency_minor_unit: z.number(),
  currency_decimal_separator: z.string(),
  currency_thousand_separator: z.string(),
  currency_prefix: z.string(),
  currency_suffix: z.string(),
  total_discount: z.string(),
  total_discount_tax: z.string(),
});

export type CartCouponTotalResponse = z.infer<
  typeof CartCouponTotalResponseSchema
>;
export class ApiCartCouponTotalResponse extends createZodDto(
  CartCouponTotalResponseSchema
) {}

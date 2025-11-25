import { CartCouponTotalResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartCouponTotalResponse extends createZodDto(
  CartCouponTotalResponseSchema
) {}

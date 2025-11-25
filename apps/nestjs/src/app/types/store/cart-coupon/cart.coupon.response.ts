import { CartCouponResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartCouponResponse extends createZodDto(
  CartCouponResponseSchema
) {}

import { OrderCouponResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderCouponResponse extends createZodDto(
  OrderCouponResponseSchema
) {}

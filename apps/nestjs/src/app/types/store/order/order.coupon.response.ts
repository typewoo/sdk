import { OrderCouponResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderCouponResponse extends createZodDto(
  OrderCouponResponseSchema
) {}

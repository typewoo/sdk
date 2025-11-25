import { CartCouponTotalResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartCouponTotalResponse extends createZodDto(
  CartCouponTotalResponseSchema
) {}

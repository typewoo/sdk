import { CartItemQuantityLimitsResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemQuantityLimitsResponse extends createZodDto(
  CartItemQuantityLimitsResponseSchema
) {}

import { CartItemQuantityLimitsResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemQuantityLimitsResponse extends createZodDto(
  CartItemQuantityLimitsResponseSchema
) {}

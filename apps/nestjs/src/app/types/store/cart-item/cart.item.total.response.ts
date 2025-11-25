import { CartItemTotalResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemTotalResponse extends createZodDto(
  CartItemTotalResponseSchema
) {}

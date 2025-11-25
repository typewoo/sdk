import { CartItemTotalResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemTotalResponse extends createZodDto(
  CartItemTotalResponseSchema
) {}

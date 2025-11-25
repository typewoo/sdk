import { CartItemPriceResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemPriceResponse extends createZodDto(
  CartItemPriceResponseSchema
) {}

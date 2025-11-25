import { CartItemPriceResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemPriceResponse extends createZodDto(
  CartItemPriceResponseSchema
) {}

import { CartItemVariationResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemVariationResponse extends createZodDto(
  CartItemVariationResponseSchema
) {}

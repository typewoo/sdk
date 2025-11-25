import { CartItemVariationResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemVariationResponse extends createZodDto(
  CartItemVariationResponseSchema
) {}

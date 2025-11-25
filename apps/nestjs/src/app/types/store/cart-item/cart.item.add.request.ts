import { CartItemAddRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemAddRequest extends createZodDto(
  CartItemAddRequestSchema
) {}

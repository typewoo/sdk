import { CartItemAddRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemAddRequest extends createZodDto(
  CartItemAddRequestSchema
) {}

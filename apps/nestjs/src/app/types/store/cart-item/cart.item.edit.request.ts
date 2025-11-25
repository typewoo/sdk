import { CartItemEditRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemEditRequest extends createZodDto(
  CartItemEditRequestSchema
) {}

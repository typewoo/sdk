import { CartItemEditRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemEditRequest extends createZodDto(
  CartItemEditRequestSchema
) {}

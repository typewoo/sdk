import { CartShippingResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartShippingResponse extends createZodDto(
  CartShippingResponseSchema
) {}

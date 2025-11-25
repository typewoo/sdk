import { CartShippingResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartShippingResponse extends createZodDto(
  CartShippingResponseSchema
) {}

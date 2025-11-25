import { CartShippingRateResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartShippingRateResponse extends createZodDto(
  CartShippingRateResponseSchema
) {}

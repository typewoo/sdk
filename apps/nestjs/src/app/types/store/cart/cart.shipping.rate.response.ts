import { CartShippingRateResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartShippingRateResponse extends createZodDto(
  CartShippingRateResponseSchema
) {}

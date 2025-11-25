import { CheckoutShippingResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutShippingResponse extends createZodDto(
  CheckoutShippingResponseSchema
) {}

import { CheckoutShippingResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutShippingResponse extends createZodDto(
  CheckoutShippingResponseSchema
) {}

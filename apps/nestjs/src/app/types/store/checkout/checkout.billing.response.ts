import { CheckoutBillingResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutBillingResponse extends createZodDto(
  CheckoutBillingResponseSchema
) {}

import { CheckoutBillingResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutBillingResponse extends createZodDto(
  CheckoutBillingResponseSchema
) {}

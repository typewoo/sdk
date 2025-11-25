import { CartBillingResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartBillingResponse extends createZodDto(
  CartBillingResponseSchema
) {}

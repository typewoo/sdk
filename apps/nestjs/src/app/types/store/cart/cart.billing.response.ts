import { CartBillingResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartBillingResponse extends createZodDto(
  CartBillingResponseSchema
) {}

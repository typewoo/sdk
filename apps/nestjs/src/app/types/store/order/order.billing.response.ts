import { OrderBillingResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderBillingResponse extends createZodDto(
  OrderBillingResponseSchema
) {}

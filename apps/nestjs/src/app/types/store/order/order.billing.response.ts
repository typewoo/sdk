import { OrderBillingResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderBillingResponse extends createZodDto(
  OrderBillingResponseSchema
) {}

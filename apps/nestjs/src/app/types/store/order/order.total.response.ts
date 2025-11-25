import { OrderTotalResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderTotalResponse extends createZodDto(
  OrderTotalResponseSchema
) {}

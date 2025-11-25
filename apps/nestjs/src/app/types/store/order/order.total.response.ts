import { OrderTotalResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderTotalResponse extends createZodDto(
  OrderTotalResponseSchema
) {}

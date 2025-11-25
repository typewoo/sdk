import { OrderShippingResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderShippingResponse extends createZodDto(
  OrderShippingResponseSchema
) {}

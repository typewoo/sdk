import { OrderShippingResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderShippingResponse extends createZodDto(
  OrderShippingResponseSchema
) {}

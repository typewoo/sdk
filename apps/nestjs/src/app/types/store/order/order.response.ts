import { OrderResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderResponse extends createZodDto(OrderResponseSchema) {}

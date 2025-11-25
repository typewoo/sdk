import { OrderRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderRequest extends createZodDto(OrderRequestSchema) {}

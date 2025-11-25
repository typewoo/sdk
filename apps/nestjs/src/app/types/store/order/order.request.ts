import { OrderRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderRequest extends createZodDto(OrderRequestSchema) {}

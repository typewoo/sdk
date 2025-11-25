import { OrderResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiOrderResponse extends createZodDto(OrderResponseSchema) {}

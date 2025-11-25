import { CartResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartResponse extends createZodDto(CartResponseSchema) {}

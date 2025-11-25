import { CartResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartResponse extends createZodDto(CartResponseSchema) {}

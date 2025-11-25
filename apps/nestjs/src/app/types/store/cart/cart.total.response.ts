import { CartTotalResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartTotalResponse extends createZodDto(
  CartTotalResponseSchema
) {}

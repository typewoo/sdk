import { CartTotalResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartTotalResponse extends createZodDto(
  CartTotalResponseSchema
) {}

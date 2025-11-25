import { CartCustomerRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartCustomerRequest extends createZodDto(
  CartCustomerRequestSchema
) {}

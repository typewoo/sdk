import { CartCustomerRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartCustomerRequest extends createZodDto(
  CartCustomerRequestSchema
) {}

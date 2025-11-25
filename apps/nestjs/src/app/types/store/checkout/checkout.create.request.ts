import { CheckoutCreateRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutCreateRequest extends createZodDto(
  CheckoutCreateRequestSchema
) {}

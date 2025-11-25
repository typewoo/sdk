import { CheckoutCreateRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutCreateRequest extends createZodDto(
  CheckoutCreateRequestSchema
) {}

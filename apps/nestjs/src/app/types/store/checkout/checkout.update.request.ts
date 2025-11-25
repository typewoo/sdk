import { CheckoutUpdateRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutUpdateRequest extends createZodDto(
  CheckoutUpdateRequestSchema
) {}

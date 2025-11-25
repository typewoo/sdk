import { CheckoutUpdateRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutUpdateRequest extends createZodDto(
  CheckoutUpdateRequestSchema
) {}

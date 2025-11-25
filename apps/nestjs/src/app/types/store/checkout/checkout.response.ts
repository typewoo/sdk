import { CheckoutResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutResponse extends createZodDto(CheckoutResponseSchema) {}

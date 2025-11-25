import { CheckoutResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCheckoutResponse extends createZodDto(CheckoutResponseSchema) {}

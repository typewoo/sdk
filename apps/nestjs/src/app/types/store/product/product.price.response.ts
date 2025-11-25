import { ProductPriceResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductPriceResponse extends createZodDto(
  ProductPriceResponseSchema
) {}

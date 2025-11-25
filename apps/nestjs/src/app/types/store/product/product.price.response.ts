import { ProductPriceResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductPriceResponse extends createZodDto(
  ProductPriceResponseSchema
) {}

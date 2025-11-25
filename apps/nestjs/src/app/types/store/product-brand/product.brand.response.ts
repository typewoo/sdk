import { ProductBrandResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductBrandResponse extends createZodDto(
  ProductBrandResponseSchema
) {}

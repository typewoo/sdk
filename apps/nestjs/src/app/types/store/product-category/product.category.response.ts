import { ProductCategoryResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCategoryResponse extends createZodDto(
  ProductCategoryResponseSchema
) {}

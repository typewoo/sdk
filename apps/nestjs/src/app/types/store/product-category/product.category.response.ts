import { ProductCategoryResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCategoryResponse extends createZodDto(
  ProductCategoryResponseSchema
) {}

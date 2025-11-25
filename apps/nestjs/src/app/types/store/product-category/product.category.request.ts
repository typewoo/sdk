import { ProductCategoryRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCategoryRequest extends createZodDto(
  ProductCategoryRequestSchema
) {}

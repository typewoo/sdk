import { ProductCategoryRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCategoryRequest extends createZodDto(
  ProductCategoryRequestSchema
) {}

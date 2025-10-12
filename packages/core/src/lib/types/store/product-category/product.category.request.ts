import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductCategoryRequestSchema = PaginatedSchema;

export type ProductCategoryRequest = z.infer<
  typeof ProductCategoryRequestSchema
>;
export class ApiProductCategoryRequest extends createZodDto(
  ProductCategoryRequestSchema
) {}

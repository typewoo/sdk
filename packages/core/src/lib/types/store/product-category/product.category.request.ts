import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductCategoryRequestSchema = PaginatedSchema;

export type ProductCategoryRequest = z.infer<
  typeof ProductCategoryRequestSchema
>;

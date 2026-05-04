import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductCategoryRequestSchema = PaginatedSchema.omit({
  offset: true,
});

export type ProductCategoryRequest = z.infer<
  typeof ProductCategoryRequestSchema
>;

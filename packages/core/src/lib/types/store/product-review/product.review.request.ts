import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductReviewRequestSchema = PaginatedSchema.extend({
  /**
   * Order sort attribute ascending or descending. Allowed values: `asc`, `desc`
   */
  order: z.enum(['asc', 'desc']).optional(),
  /**
   * Sort collection by object attribute.
   * Allowed values : `date`, `date_gmt`, `id`, `rating`, `product`
   */
  orderby: z.enum(['date', 'date_gmt', 'id', 'rating', 'product']).optional(),
  /**
   * Limit result set to reviews from specific category IDs.
   */
  category_id: z.string().optional(),
  /**
   * Limit result set to reviews from specific product IDs.
   */
  product_id: z.string().optional(),
});

export type ProductReviewRequest = z.infer<typeof ProductReviewRequestSchema>;
export class ApiProductReviewRequest extends createZodDto(
  ProductReviewRequestSchema
) {}

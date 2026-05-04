import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductReviewRequestSchema = PaginatedSchema.extend({
  /**
   * Order sort attribute ascending or descending. Allowed values: `asc`, `desc`
   */
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  /**
   * Sort collection by object attribute.
   * Allowed values : `date`, `date_gmt`, `id`, `rating`, `product`
   */
  orderby: z
    .enum(['date', 'date_gmt', 'id', 'rating', 'product'])
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  /**
   * Limit result set to reviews from specific category IDs.
   */
  category_id: z
    .string()
    .optional()
    .describe('Limit result set to reviews from specific category IDs.'),
  /**
   * Limit result set to reviews from specific product IDs.
   */
  product_id: z
    .string()
    .optional()
    .describe('Limit result set to reviews from specific product IDs.'),
});

export type ProductReviewRequest = z.infer<typeof ProductReviewRequestSchema>;

import { z } from 'zod';

/**
 * Review request parameters for POST /products/reviews (create). WooCommerce
 * requires `product_id`, `review`, `reviewer`, and `reviewer_email` to
 * register a new review.
 */
export const AdminProductReviewCreateRequestSchema = z.looseObject({
  product_id: z.number().describe('Unique identifier for the product.'),
  product_name: z.string().optional().describe('Product name.'),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .default('approved')
    .optional()
    .describe('Status of the review.'),
  reviewer: z.string().describe('Name of the reviewer.'),
  reviewer_email: z.string().describe('Email of the reviewer.'),
  review: z.string().describe('Review content.'),
  rating: z.number().optional().describe('Review rating (0 to 5).'),
});

export type AdminProductReviewCreateRequest = z.input<
  typeof AdminProductReviewCreateRequestSchema
>;

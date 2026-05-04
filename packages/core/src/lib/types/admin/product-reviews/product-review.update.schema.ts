import { z } from 'zod';

/**
 * Review request parameters for PUT /products/reviews/{id} (update).
 */
export const AdminProductReviewUpdateRequestSchema = z.looseObject({
  product_id: z
    .number()
    .optional()
    .describe('Unique identifier for the product that the review belongs to.'),
  product_name: z.string().optional().describe('Product name.'),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .optional()
    .describe('Status of the review.'),
  reviewer: z.string().optional().describe('Reviewer name.'),
  reviewer_email: z.string().optional().describe('Reviewer email.'),
  review: z.string().optional().describe('The content of the review.'),
  rating: z.number().optional().describe('Review rating (0 to 5).'),
});

export type AdminProductReviewUpdateRequest = z.input<
  typeof AdminProductReviewUpdateRequestSchema
>;

import { z } from 'zod';

export const AdminProductReviewSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  date_created: z.string().describe('The date the review was created, in the site\'s timezone.'),
  date_created_gmt: z.string().describe('The date the review was created, as GMT.'),
  product_id: z.number().describe('Unique identifier for the product that the review belongs to.'),
  product_name: z.string().describe('Product name.'),
  product_permalink: z.string().describe('Product URL.'),
  status: z.enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash']).describe('Status of the review.'),
  reviewer: z.string().describe('Reviewer name.'),
  reviewer_email: z.string().describe('Reviewer email.'),
  review: z.string().describe('The content of the review.'),
  rating: z.number().describe('Review rating (0 to 5).'),
  verified: z.boolean().describe('Shows if the reviewer bought the product or not.'),
  reviewer_avatar_urls: z.object({
    '24': z.string().describe('Avatar URL with image size of 24 pixels.'),
    '48': z.string().describe('Avatar URL with image size of 48 pixels.'),
    '96': z.string().describe('Avatar URL with image size of 96 pixels.'),
  }).describe('Avatar URLs for the object reviewer.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminProductReview = z.infer<typeof AdminProductReviewSchema>;

/**
 * Review request parameters for POST /products/reviews (create). WooCommerce
 * requires `product_id`, `review`, `reviewer`, and `reviewer_email` to
 * register a new review.
 */
export const AdminProductReviewCreateRequestSchema = z.looseObject({
  product_id: z
    .number()
    .describe('Unique identifier for the product that the review belongs to.'),
  product_name: z.string().optional(),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .optional(),
  reviewer: z.string().describe('Reviewer name.'),
  reviewer_email: z.string().describe('Reviewer email.'),
  review: z.string().describe('The content of the review.'),
  rating: z.number().optional(),
});

export type AdminProductReviewCreateRequest = z.input<
  typeof AdminProductReviewCreateRequestSchema
>;

/**
 * Review request parameters for PUT /products/reviews/{id} (update).
 */
export const AdminProductReviewUpdateRequestSchema = z.looseObject({
  product_id: z.number().optional(),
  product_name: z.string().optional(),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .optional(),
  reviewer: z.string().optional(),
  reviewer_email: z.string().optional(),
  review: z.string().optional(),
  rating: z.number().optional(),
});

export type AdminProductReviewUpdateRequest = z.input<
  typeof AdminProductReviewUpdateRequestSchema
>;

export const AdminProductReviewQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z.enum(['date', 'date_gmt', 'id', 'include', 'product']).optional(),
  reviewer: z.array(z.string()).optional(),
  reviewer_exclude: z.array(z.number()).optional(),
  reviewer_email: z.string().optional(),
  product: z.array(z.number()).optional(),
  status: z.string().optional(),
});

export type AdminProductReviewQueryParams = z.infer<
  typeof AdminProductReviewQueryParamsSchema
>;

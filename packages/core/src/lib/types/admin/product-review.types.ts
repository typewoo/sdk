import { z } from 'zod';

export const AdminProductReviewSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  date_created: z
    .string()
    .describe("The date the review was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the review was created, as GMT.'),
  product_id: z
    .number()
    .describe('Unique identifier for the product that the review belongs to.'),
  product_name: z.string().describe('Product name.'),
  product_permalink: z.string().describe('Product URL.'),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .describe('Status of the review.'),
  reviewer: z.string().describe('Reviewer name.'),
  reviewer_email: z.string().describe('Reviewer email.'),
  review: z.string().describe('The content of the review.'),
  rating: z.number().describe('Review rating (0 to 5).'),
  verified: z
    .boolean()
    .describe('Shows if the reviewer bought the product or not.'),
  reviewer_avatar_urls: z
    .object({
      '24': z.string().describe('Avatar URL with image size of 24 pixels.'),
      '48': z.string().describe('Avatar URL with image size of 48 pixels.'),
      '96': z.string().describe('Avatar URL with image size of 96 pixels.'),
    })
    .describe('Avatar URLs for the object reviewer.'),
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
  product_name: z.string().optional().describe('Product name.'),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .optional()
    .describe('Status of the review.'),
  reviewer: z.string().describe('Reviewer name.'),
  reviewer_email: z.string().describe('Reviewer email.'),
  review: z.string().describe('The content of the review.'),
  rating: z.number().optional().describe('Review rating (0 to 5).'),
});

export type AdminProductReviewCreateRequest = z.input<
  typeof AdminProductReviewCreateRequestSchema
>;

/**
 * Review request parameters for PUT /products/reviews/{id} (update).
 */
export const AdminProductReviewUpdateRequestSchema = z.looseObject({
  product_id: z.number().optional(),
  product_name: z.string().optional().describe('Product name.'),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .optional()
    .describe('Status of the review.'),
  reviewer: z
    .string()
    .optional()
    .describe('Limit result set to reviews assigned to specific user IDs.'),
  reviewer_email: z
    .string()
    .optional()
    .describe('Limit result set to that from a specific author email.'),
  review: z.string().optional(),
  rating: z.number().optional().describe('Review rating (0 to 5).'),
});

export type AdminProductReviewUpdateRequest = z.input<
  typeof AdminProductReviewUpdateRequestSchema
>;

export const AdminProductReviewQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to reviews published before a given ISO8601 compliant date.'
    ),
  exclude: z
    .array(z.number())
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .optional()
    .describe('Limit result set to specific IDs.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['date', 'date_gmt', 'id', 'include', 'product'])
    .optional()
    .describe('Sort collection by object attribute.'),
  reviewer: z
    .array(z.string())
    .optional()
    .describe('Limit result set to reviews assigned to specific user IDs.'),
  reviewer_exclude: z
    .array(z.number())
    .optional()
    .describe(
      'Ensure result set excludes reviews assigned to specific user IDs.'
    ),
  reviewer_email: z
    .string()
    .optional()
    .describe('Limit result set to that from a specific author email.'),
  product: z
    .array(z.number())
    .optional()
    .describe('Limit result set to reviews assigned to specific product IDs.'),
  status: z.string().optional().describe('Status of the review.'),
});

export type AdminProductReviewQueryParams = z.infer<
  typeof AdminProductReviewQueryParamsSchema
>;

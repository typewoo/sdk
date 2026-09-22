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
    .optional()
    .describe('Unique identifier for the product that the review belongs to.'),
  product_name: z.string().optional().describe('Product name.'),
  product_permalink: z.string().optional().describe('Product URL.'),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .default('approved')
    .optional()
    .describe('Status of the review.'),
  reviewer: z.string().optional().describe('Reviewer name.'),
  reviewer_email: z.string().optional().describe('Reviewer email.'),
  review: z.string().optional().describe('The content of the review.'),
  rating: z.number().optional().describe('Review rating (0 to 5).'),
  verified: z
    .boolean()
    .optional()
    .describe('Shows if the reviewer bought the product or not.'),
  reviewer_avatar_urls: z
    .object({
      '24': z
        .string()
        .optional()
        .describe('Avatar URL with image size of 24 pixels.'),
      '48': z
        .string()
        .optional()
        .describe('Avatar URL with image size of 48 pixels.'),
      '96': z
        .string()
        .optional()
        .describe('Avatar URL with image size of 96 pixels.'),
    })
    .optional()
    .describe('Avatar URLs for the object reviewer.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })).optional(),
    })
    .optional(),
});

export type AdminProductReview = z.infer<typeof AdminProductReviewSchema>;

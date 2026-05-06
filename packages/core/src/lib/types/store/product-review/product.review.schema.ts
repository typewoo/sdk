import { z } from 'zod';
import { ImageResponseSchema } from '../image.schema.js';

export const ProductReviewResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  date_created: z
    .string()
    .describe("The date the review was created, in the site's timezone."),
  formatted_date_created: z
    .string()
    .describe(
      "The date the review was created, in the site's timezone in human-readable format."
    ),
  date_created_gmt: z
    .string()
    .describe('The date the review was created, as GMT.'),
  product_id: z
    .number()
    .describe('Unique identifier for the product that the review belongs to.'),
  product_name: z
    .string()
    .describe('Name of the product that the review belongs to.'),
  product_permalink: z
    .string()
    .describe('Permalink of the product that the review belongs to.'),
  product_image: ImageResponseSchema.describe(
    'Image of the product that the review belongs to.'
  ),
  reviewer: z.string().describe('Reviewer name.'),
  review: z.string().describe('The content of the review.'),
  rating: z.number().describe('Review rating (0 to 5).'),
  verified: z
    .boolean()
    .describe('Shows if the reviewer bought the product or not.'),
  reviewer_avatar_urls: z
    .looseObject({
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
    .describe('Avatar URLs for the object reviewer.'),
});

export type ProductReviewResponse = z.infer<typeof ProductReviewResponseSchema>;

import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';

export const ProductReviewResponseSchema = z.object({
  id: z.number(),
  date_created: z.string(),
  formatted_date_created: z.string(),
  date_created_gmt: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  product_permalink: z.string(),
  product_image: ImageResponseSchema,
  reviewer: z.string(),
  review: z.string(),
  rating: z.number(),
  verified: z.boolean(),
  reviewer_avatar_urls: z.array(z.record(z.string(), z.string())),
});

export type ProductReviewResponse = z.infer<typeof ProductReviewResponseSchema>;

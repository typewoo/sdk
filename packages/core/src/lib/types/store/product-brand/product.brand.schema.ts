import { z } from 'zod';
import { ImageResponseSchema } from '../image.schema.js';

export const ProductBrandResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Term name.'),
  slug: z.string().describe('String based identifier for the term.'),
  description: z.string().describe('Term description.'),
  parent: z.number().describe('Parent term ID, if applicable.'),
  count: z
    .number()
    .describe('Number of objects (posts of any type) assigned to the term.'),
  image: ImageResponseSchema.describe('Brand image.'),
  review_count: z
    .number()
    .describe('Number of reviews for products of this brand.'),
  permalink: z.string().describe('Brand URL.'),
});

export type ProductBrandResponse = z.infer<typeof ProductBrandResponseSchema>;

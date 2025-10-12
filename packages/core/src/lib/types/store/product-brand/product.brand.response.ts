import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';

export const ProductBrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  parent: z.number(),
  count: z.number(),
  image: ImageResponseSchema.nullable(),
  review_count: z.number(),
  permalink: z.string(),
});

export type ProductBrandResponse = z.infer<typeof ProductBrandResponseSchema>;
export class ApiProductBrandResponse extends createZodDto(
  ProductBrandResponseSchema
) {}

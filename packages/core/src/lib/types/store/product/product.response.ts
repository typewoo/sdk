import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';
import { ProductPriceResponseSchema } from './product.price.response.js';

export const ProductResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  variation: z.string(),
  permalink: z.string(),
  sku: z.string(),
  summary: z.string(),
  short_description: z.string(),
  description: z.string(),
  on_sale: z.boolean(),
  prices: ProductPriceResponseSchema,
  average_rating: z.string(),
  review_count: z.number(),
  images: z.array(ImageResponseSchema),
  has_options: z.boolean(),
  is_purchasable: z.boolean(),
  is_in_stock: z.boolean(),
  low_stock_remaining: z.unknown(),
  add_to_cart: z.object({
    text: z.string(),
    description: z.string(),
  }),
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export class ApiProductResponse extends createZodDto(ProductResponseSchema) {}

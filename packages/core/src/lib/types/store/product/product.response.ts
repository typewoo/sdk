import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';
import { ProductPriceResponseSchema } from './product.price.response.js';

export const ProductResponseSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parent: z.number(),
  type: z.string(),
  variation: z.string(),
  permalink: z.string(),
  sku: z.string(),
  short_description: z.string(),
  description: z.string(),
  on_sale: z.boolean(),
  prices: ProductPriceResponseSchema,
  price_html: z.string(),
  average_rating: z.string(),
  review_count: z.number(),
  images: z.array(ImageResponseSchema),
  categories: z.array(
    z.looseObject({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      link: z.string(),
    })
  ),
  tags: z.array(
    z.looseObject({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      link: z.string(),
    })
  ),
  brands: z.array(
    z.looseObject({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      link: z.string(),
    })
  ),
  attributes: z.array(z.unknown()),
  variations: z.array(z.unknown()),
  grouped_products: z.array(z.unknown()),
  has_options: z.boolean(),
  is_purchasable: z.boolean(),
  is_in_stock: z.boolean(),
  is_on_backorder: z.boolean(),
  low_stock_remaining: z.unknown(),
  stock_availability: z.looseObject({
    text: z.string(),
    class: z.string(),
  }),
  sold_individually: z.boolean(),
  add_to_cart: z.looseObject({
    text: z.string(),
    description: z.string(),
    url: z.string(),
    single_text: z.string(),
    maximum: z.number(),
    minimum: z.number(),
    multiple_of: z.number(),
  }),
  extensions: z.unknown(),
});
export type ProductResponse = z.infer<typeof ProductResponseSchema>;

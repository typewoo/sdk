import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';
import { ProductPriceResponseSchema } from './product.price.response.js';

export const ProductEmbeddedAttributeResponseSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  taxonomy: z.string(),
  has_variations: z.boolean(),
  terms: z.array(
    z.looseObject({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    })
  ),
});

export type ProductEmbeddedAttributeResponse = z.infer<
  typeof ProductEmbeddedAttributeResponseSchema
>;

export const ProductEmbeddedVariationResponseSchema = z.looseObject({
  id: z.number(),
  attributes: z.array(
    z.looseObject({
      name: z.string(),
      value: z.string(),
    })
  ),
});

export type ProductEmbeddedVariationResponse = z.infer<
  typeof ProductEmbeddedVariationResponseSchema
>;

export const ProductResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Product name.'),
  slug: z.string().optional().describe('Product slug.'),
  parent: z.number().describe('ID of the parent product, if applicable.'),
  type: z.string().describe('Product type.'),
  variation: z
    .string()
    .optional()
    .describe('Product variation attributes, if applicable.'),
  permalink: z.string().describe('Product URL.'),
  sku: z.string().optional().describe('Unique identifier.'),
  short_description: z
    .string()
    .optional()
    .describe('Product short description in HTML format.'),
  description: z
    .string()
    .optional()
    .describe('Product full description in HTML format.'),
  on_sale: z.boolean().describe('Is the product on sale?'),
  prices: ProductPriceResponseSchema.describe(
    'Price data provided using the smallest unit of the currency.'
  ),
  price_html: z.string().describe('Price string formatted as HTML.'),
  average_rating: z.string().describe('Reviews average rating.'),
  review_count: z.number().describe('Amount of reviews that the product has.'),
  images: z.array(ImageResponseSchema).optional().describe('List of images.'),
  categories: z
    .array(
      z.looseObject({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        link: z.string(),
      })
    )
    .optional()
    .describe('List of categories, if applicable.'),
  tags: z
    .array(
      z.looseObject({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        link: z.string(),
      })
    )
    .optional()
    .describe('List of tags, if applicable.'),
  brands: z
    .array(
      z.looseObject({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        link: z.string(),
      })
    )
    .optional()
    .describe('List of brands, if applicable.'),
  attributes: z
    .array(ProductEmbeddedAttributeResponseSchema)
    .optional()
    .describe(
      'List of attributes (taxonomy terms) assigned to the product. For variable products, these are used to assign the available variation attributes and values.'
    ),
  variations: z
    .array(ProductEmbeddedVariationResponseSchema)
    .optional()
    .describe('List of variation IDs, if applicable.'),
  grouped_products: z
    .array(z.unknown())
    .optional()
    .describe('List of grouped product IDs, if applicable.'),
  has_options: z
    .boolean()
    .describe(
      'Does the product have additional options before it can be added to the cart?'
    ),
  is_purchasable: z.boolean().describe('Is the product purchasable?'),
  is_in_stock: z.boolean().describe('Is the product in stock?'),
  is_on_backorder: z
    .boolean()
    .describe(
      'Is the product stock backordered? This will also return false if the product is not being tracked for stock.'
    ),
  low_stock_remaining: z
    .union([z.unknown(), z.null()])
    .describe(
      'Quantity left in stock if stock is low, or null if not applicable.'
    ),
  stock_availability: z
    .looseObject({
      text: z.string().describe('Stock availability text.'),
      class: z.string().describe('Stock availability class.'),
    })
    .describe("Information about the product's availability."),
  sold_individually: z
    .boolean()
    .describe(
      'If true, only one item of this product is allowed for purchase in a single order.'
    ),
  add_to_cart: z
    .looseObject({
      text: z.string().describe('Button text.'),
      description: z.string().describe('Button description.'),
      url: z.string().describe('Add to cart URL.'),
      single_text: z
        .string()
        .describe('Button text in the single product page.'),
      maximum: z
        .number()
        .describe('The maximum quantity that can be added to the cart.'),
      minimum: z
        .number()
        .describe('The minimum quantity that can be added to the cart.'),
      multiple_of: z
        .number()
        .default(1)
        .describe(
          'The amount that quantities increment by. Quantity must be an multiple of this value.'
        ),
    })
    .describe('Add to cart button parameters.'),
  extensions: z.unknown().optional(),
});
export type ProductResponse = z.infer<typeof ProductResponseSchema>;

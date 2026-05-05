import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';
import { CartItemPriceResponseSchema } from './cart.item.price.response.js';
import { CartItemQuantityLimitsResponseSchema } from './cart.item.quantity.limits.response.js';
import { CartItemTotalResponseSchema } from './cart.item.total.response.js';
import { CartItemVariationResponseSchema } from './cart.item.variation.response.js';

export const CartItemResponseSchema = z.looseObject({
  key: z.string().describe('Unique identifier for the item.'),
  id: z.number().describe('The item product or variation ID.'),
  quantity: z.number().describe('Quantity of this item.'),
  type: z.string().describe('The item type.'),
  quantity_limits: CartItemQuantityLimitsResponseSchema.describe(
    'How the quantity of this item should be controlled, for example, any limits in place.'
  ),
  name: z.string().describe('Product name.'),
  short_description: z
    .string()
    .describe('Product short description in HTML format.'),
  description: z.string().describe('Product full description in HTML format.'),
  sku: z.string().describe('Stock keeping unit, if applicable.'),
  low_stock_remaining: z
    .number()
    .nullable()
    .describe(
      'Quantity left in stock if stock is low, or null if not applicable.'
    ),
  backorders_allowed: z
    .boolean()
    .describe('True if backorders are allowed past stock availability.'),
  show_backorder_badge: z
    .boolean()
    .describe('True if the product is on backorder.'),
  sold_individually: z
    .boolean()
    .describe(
      'If true, only one item of this product is allowed for purchase in a single order.'
    ),
  permalink: z.string().describe('Product URL.'),
  images: z.array(ImageResponseSchema).describe('List of images.'),
  variation: z
    .array(CartItemVariationResponseSchema)
    .describe('Chosen attributes (for variations).'),
  item_data: z
    .array(
      z.looseObject({
        name: z.string(),
        value: z.string(),
        display: z.string(),
      })
    )
    .describe('Metadata related to the item'),
  prices: CartItemPriceResponseSchema.describe(
    'Price data for the product in the current line item, including or excluding taxes based on the "display prices during cart and checkout" setting. Provided using the smallest unit of the currency.'
  ),
  totals: CartItemTotalResponseSchema.describe(
    'Item total amounts provided using the smallest unit of the currency.'
  ),
  catalog_visibility: z
    .string()
    .describe('Whether the product is visible in the catalog'),
  extensions: z.unknown().optional(),
});

export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;

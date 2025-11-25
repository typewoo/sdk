import { z } from 'zod';
import { ImageResponseSchema } from '../image.response.js';
import { CartItemPriceResponseSchema } from './cart.item.price.response.js';
import { CartItemQuantityLimitsResponseSchema } from './cart.item.quantity.limits.response.js';
import { CartItemTotalResponseSchema } from './cart.item.total.response.js';
import { CartItemVariationResponseSchema } from './cart.item.variation.response.js';

export const CartItemResponseSchema = z.object({
  key: z.string(),
  id: z.number(),
  quantity: z.number(),
  type: z.string(),
  quantity_limits: CartItemQuantityLimitsResponseSchema,
  name: z.string(),
  short_description: z.string(),
  description: z.string(),
  sku: z.string(),
  low_stock_remaining: z.number().nullable(),
  backorders_allowed: z.boolean(),
  show_backorder_badge: z.boolean(),
  sold_individually: z.boolean(),
  permalink: z.string(),
  images: z.array(ImageResponseSchema),
  variation: z.array(CartItemVariationResponseSchema),
  item_data: z.array(z.unknown()),
  prices: CartItemPriceResponseSchema,
  totals: CartItemTotalResponseSchema,
  catalog_visibility: z.string(),
  extensions: z.unknown(),
});

export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;

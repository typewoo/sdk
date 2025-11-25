import { z } from 'zod';

export const CartItemAddRequestSchema = z.object({
  /**
   * The cart item product or variation ID.
   */
  id: z.number(),
  /**
   * Quantity of this item in the cart.
   */
  quantity: z.number().optional(),
  /**
   * Chosen attributes (for variations) containing an array of objects with keys `attribute` and `value`.
   */
  variation: z.array(z.record(z.string(), z.string())).optional(),
});

export type CartItemAddRequest = z.infer<typeof CartItemAddRequestSchema>;

import { z } from 'zod';

export const CartItemAddRequestSchema = z.looseObject({
  /**
   * The cart item product or variation ID.
   */
  id: z.number().optional().describe('The cart item product or variation ID.'),
  /**
   * Quantity of this item in the cart.
   */
  quantity: z
    .number()
    .optional()
    .describe('Quantity of this item to add to the cart.'),
  /**
   * Chosen attributes (for variations) containing an array of objects with keys `attribute` and `value`.
   */
  variation: z
    .array(z.record(z.string(), z.string()))
    .optional()
    .describe('Chosen attributes (for variations).'),
});

export type CartItemAddRequest = z.infer<typeof CartItemAddRequestSchema>;

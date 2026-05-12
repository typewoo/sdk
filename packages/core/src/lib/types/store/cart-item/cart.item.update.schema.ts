import { z } from 'zod';

export const CartItemEditRequestSchema = z.looseObject({
  /**
   * The key of the cart item to edit.
   */
  key: z
    .string()
    .optional()
    .describe('Unique identifier (key) for the cart item to update.'),
  /**
   * Quantity of this item in the cart.
   */
  quantity: z
    .number()
    .optional()
    .describe('New quantity of the item in the cart.'),
});

export type CartItemEditRequest = z.infer<typeof CartItemEditRequestSchema>;

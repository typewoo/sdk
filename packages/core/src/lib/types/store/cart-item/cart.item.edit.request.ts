import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CartItemEditRequestSchema = z.object({
  /**
   * The key of the cart item to edit.
   */
  key: z.string(),
  /**
   * Quantity of this item in the cart.
   */
  quantity: z.number(),
});

export type CartItemEditRequest = z.infer<typeof CartItemEditRequestSchema>;
export class ApiCartItemEditRequest extends createZodDto(
  CartItemEditRequestSchema
) {}

import { z } from 'zod';

export const CartItemQuantityLimitsResponseSchema = z.looseObject({
  minimum: z
    .number()
    .describe('The minimum quantity allowed for this line item.'),
  maximum: z
    .number()
    .describe('The maximum quantity allowed for this line item.'),
  multiple_of: z
    .number()
    .default(1)
    .describe(
      'The amount that quantities increment by. Quantity must be an multiple of this value.'
    ),
  editable: z
    .boolean()
    .default(true)
    .describe('If the quantity is editable or fixed.'),
});

export type CartItemQuantityLimitsResponse = z.infer<
  typeof CartItemQuantityLimitsResponseSchema
>;

import { z } from 'zod';

export const CartItemVariationResponseSchema = z.object({
  raw_attribute: z.string(),
  attribute: z.string(),
  value: z.string(),
});

export type CartItemVariationResponse = z.infer<
  typeof CartItemVariationResponseSchema
>;

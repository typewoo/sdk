import { z } from 'zod';

export const CartItemVariationResponseSchema = z.looseObject({
  raw_attribute: z.string(),
  attribute: z.string(),
  value: z.string(),
});

export type CartItemVariationResponse = z.infer<
  typeof CartItemVariationResponseSchema
>;

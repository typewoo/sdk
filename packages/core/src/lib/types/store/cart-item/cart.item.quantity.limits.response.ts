import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CartItemQuantityLimitsResponseSchema = z.object({
  minimum: z.number(),
  maximum: z.number(),
  multiple_of: z.number(),
  editable: z.boolean(),
});

export type CartItemQuantityLimitsResponse = z.infer<
  typeof CartItemQuantityLimitsResponseSchema
>;
export class ApiCartItemQuantityLimitsResponse extends createZodDto(
  CartItemQuantityLimitsResponseSchema
) {}

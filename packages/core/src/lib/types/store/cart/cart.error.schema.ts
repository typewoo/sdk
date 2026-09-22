import { z } from 'zod';

export const CartErrorResponseSchema = z.looseObject({
  code: z.string(),
  message: z.string(),
});

export type CartErrorResponse = z.infer<typeof CartErrorResponseSchema>;

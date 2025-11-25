import { z } from 'zod';
import { CartResponseSchema } from './store';

export const StoreSdkStateSchema = z.object({
  cart: CartResponseSchema.optional(),
  nonce: z.string().optional(),
  cartHash: z.string().optional(),
  cartToken: z.string().optional(),
  authenticated: z.boolean().optional(),
});

export type StoreSdkState = z.infer<typeof StoreSdkStateSchema>;

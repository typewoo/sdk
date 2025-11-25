import { z } from 'zod';
import { CartResponseSchema } from './store/index.js';

export const SdkStateSchema = z.object({
  cart: CartResponseSchema.optional(),
  nonce: z.string().optional(),
  cartHash: z.string().optional(),
  cartToken: z.string().optional(),
  authenticated: z.boolean().optional(),
});

export type SdkState = z.infer<typeof SdkStateSchema>;

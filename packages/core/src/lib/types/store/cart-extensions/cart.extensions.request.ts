import { z } from 'zod';

/**
 * Cart extensions request for third-party plugin data
 */
export const CartExtensionsRequestSchema = z.object({
  /**
   * Extension namespace - used to ensure data is passed to the correct extension
   */
  namespace: z.string(),

  /**
   * Extension data to be stored
   */
  data: z.record(z.string(), z.unknown()),
});

export type CartExtensionsRequest = z.infer<typeof CartExtensionsRequestSchema>;

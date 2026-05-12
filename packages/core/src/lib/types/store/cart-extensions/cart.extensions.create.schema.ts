import { z } from 'zod';

/**
 * Cart extensions request for third-party plugin data
 */
export const CartExtensionsRequestSchema = z.looseObject({
  /**
   * Extension namespace - used to ensure data is passed to the correct extension
   */
  namespace: z
    .string()
    .optional()
    .describe(
      "Extension's name - this will be used to ensure the data in the request is routed appropriately."
    ),

  /**
   * Extension data to be stored
   */
  data: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Additional data to pass to the extension'),
});

export type CartExtensionsRequest = z.infer<typeof CartExtensionsRequestSchema>;

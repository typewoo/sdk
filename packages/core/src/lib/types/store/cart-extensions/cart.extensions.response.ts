import { z } from 'zod';

/**
 * Cart extensions response
 */
export const CartExtensionsResponseSchema = z.object({
  /**
   * Extension namespace
   */
  namespace: z.string(),

  /**
   * Extension data that was stored
   */
  data: z.record(z.string(), z.unknown()),

  /**
   * Success status
   */
  success: z.boolean(),

  /**
   * Error message if operation failed
   */
  error: z.string().optional(),
});

export type CartExtensionsResponse = z.infer<
  typeof CartExtensionsResponseSchema
>;

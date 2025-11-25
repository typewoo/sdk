import { z } from 'zod';

export const BatchRequestItemSchema = z.object({
  /**
   * HTTP method for the request
   */
  method: z.enum(['POST', 'PUT', 'PATCH', 'DELETE']),

  /**
   * API path for the request (relative to WooCommerce Store API)
   */
  path: z.string(),

  /**
   * Request body data
   */
  body: z.record(z.string(), z.unknown()).optional(),

  /**
   * Request headers
   */
  headers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});
export type BatchRequestItem = z.infer<typeof BatchRequestItemSchema>;

export const BatchRequestSchema = z.object({
  /**
   * Validation mode for the batch request
   * - 'require-all-validate': All requests must validate before any are processed
   * - 'normal': Process requests individually
   */
  validation: z.enum(['require-all-validate', 'normal']).optional(),

  /**
   * Array of individual requests to process
   * Maximum of 25 requests per batch
   */
  requests: z.array(BatchRequestItemSchema).max(25),
});
export type BatchRequest = z.infer<typeof BatchRequestSchema>;

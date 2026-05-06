import { z } from 'zod';

export const BatchResponseItemSchema = z.looseObject({
  /**
   * HTTP status code of the response
   */
  status: z.number(),

  /**
   * Response headers
   */
  headers: z.record(z.string(), z.string()),

  /**
   * Response body data
   */
  body: z.unknown(),
});
export type BatchResponseItem = z.infer<typeof BatchResponseItemSchema>;

export const BatchResponseSchema = z.looseObject({
  /**
   * Array of individual response results
   */
  responses: z.array(BatchResponseItemSchema),
});
export type BatchResponse = z.infer<typeof BatchResponseSchema>;

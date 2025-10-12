import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const BatchResponseItemSchema = z.object({
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
export class ApiBatchResponseItem extends createZodDto(
  BatchResponseItemSchema
) {}

export const BatchResponseSchema = z.object({
  /**
   * Array of individual response results
   */
  responses: z.array(BatchResponseItemSchema),
});
export type BatchResponse = z.infer<typeof BatchResponseSchema>;
export class ApiBatchResponse extends createZodDto(BatchResponseSchema) {}

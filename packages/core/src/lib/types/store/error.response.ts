import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    status: z.number(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

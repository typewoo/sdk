import { z } from 'zod';

export const AuthRefreshRequestSchema = z.object({
  refresh_token: z.string().optional(),
});

export type AuthRefreshRequest = z.infer<typeof AuthRefreshRequestSchema>;

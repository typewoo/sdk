import { z } from 'zod';

export const AuthTokenRequestSchema = z.looseObject({
  login: z.string(),
  password: z.string(),
  refresh_ttl: z.number().optional(),
  access_ttl: z.number().optional(),
});

export type AuthTokenRequest = z.infer<typeof AuthTokenRequestSchema>;

import { z } from 'zod';

export const AuthTokenResponseSchema = z.object({
  token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  refresh_expires_in: z.number(),
  user: z.object({
    id: z.number(),
    login: z.string(),
    email: z.string(),
    display_name: z.string(),
  }),
});

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

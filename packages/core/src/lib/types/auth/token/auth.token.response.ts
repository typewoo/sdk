import { z } from 'zod';

export const AuthTokenResponseSchema = z.looseObject({
  token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  refresh_expires_in: z.number(),
  user: z.looseObject({
    id: z.number(),
    login: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    display_name: z.string(),
  }),
});

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

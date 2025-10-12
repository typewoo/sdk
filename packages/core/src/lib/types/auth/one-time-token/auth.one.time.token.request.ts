import { z } from 'zod';

export const AuthOneTimeTokenRequestSchema = z.object({
  ttl: z.number().optional(),
});

export type AuthOneTimeTokenRequest = z.infer<
  typeof AuthOneTimeTokenRequestSchema
>;

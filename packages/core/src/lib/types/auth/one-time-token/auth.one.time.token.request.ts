import { z } from 'zod';

export const AuthOneTimeTokenRequestSchema = z.looseObject({
  ttl: z.number().optional(),
});

export type AuthOneTimeTokenRequest = z.infer<
  typeof AuthOneTimeTokenRequestSchema
>;

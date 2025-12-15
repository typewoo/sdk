import { z } from 'zod';

export const AuthOneTimeTokenResponseSchema = z.looseObject({
  one_time_token: z.string(),
  expires_in: z.number(),
});

export type AuthOneTimeTokenResponse = z.infer<
  typeof AuthOneTimeTokenResponseSchema
>;

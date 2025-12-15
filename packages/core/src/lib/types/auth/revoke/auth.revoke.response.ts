import { z } from 'zod';

export const AuthRevokeResponseSchema = z.looseObject({
  revoked: z.boolean(),
  scope: z.string(),
  new_version: z.number(),
});

export type AuthRevokeResponse = z.infer<typeof AuthRevokeResponseSchema>;

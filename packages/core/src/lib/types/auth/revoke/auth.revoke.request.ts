import { z } from 'zod';

export const AuthRevokeRequestSchema = z.looseObject({
  scope: z.enum(['refresh', 'all']).optional(),
});

export type AuthRevokeRequest = z.infer<typeof AuthRevokeRequestSchema>;

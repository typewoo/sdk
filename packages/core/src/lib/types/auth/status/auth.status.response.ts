import { z } from 'zod';

export const AuthStatusResponseSchema = z.looseObject({
  active: z.boolean(),
  flag_defined: z.boolean(),
  flag_enabled: z.boolean(),
  secret_defined: z.boolean(),
  secret_length: z.number(),
  inactive_reason: z
    .enum(['missing_flag', 'disabled_flag', 'missing_secret'])
    .nullable()
    .optional(),
  endpoints: z.record(z.string(), z.boolean()),
  version: z.string(),
  timestamp: z.number(),
});

export type AuthStatusResponse = z.infer<typeof AuthStatusResponseSchema>;

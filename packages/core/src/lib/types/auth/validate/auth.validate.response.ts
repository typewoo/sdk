import { z } from 'zod';

export const AuthValidateResponseSchema = z.object({
  valid: z.boolean(),
  payload: z.object({
    iss: z.string(),
    iat: z.number(),
    nbf: z.number(),
    exp: z.number(),
    sub: z.number(),
    login: z.string(),
    email: z.string(),
    ver: z.number(),
  }),
});

export type AuthValidateResponse = z.infer<typeof AuthValidateResponseSchema>;

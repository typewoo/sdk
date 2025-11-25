import { AuthOneTimeTokenResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthOneTimeTokenResponse extends createZodDto(
  AuthOneTimeTokenResponseSchema
) {}

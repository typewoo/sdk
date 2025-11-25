import { AuthOneTimeTokenRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthOneTimeTokenRequest extends createZodDto(
  AuthOneTimeTokenRequestSchema
) {}

import { AuthOneTimeTokenResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthOneTimeTokenResponse extends createZodDto(
  AuthOneTimeTokenResponseSchema
) {}

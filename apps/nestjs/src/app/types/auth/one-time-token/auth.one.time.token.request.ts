import { AuthOneTimeTokenRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthOneTimeTokenRequest extends createZodDto(
  AuthOneTimeTokenRequestSchema
) {}

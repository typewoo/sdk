import { AuthTokenResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthTokenResponse extends createZodDto(
  AuthTokenResponseSchema
) {}

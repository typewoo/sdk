import { AuthTokenResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthTokenResponse extends createZodDto(
  AuthTokenResponseSchema
) {}

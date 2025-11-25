import { AuthTokenRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthTokenRequest extends createZodDto(AuthTokenRequestSchema) {}

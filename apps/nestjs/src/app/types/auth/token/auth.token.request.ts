import { AuthTokenRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthTokenRequest extends createZodDto(AuthTokenRequestSchema) {}

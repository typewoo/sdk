import { AuthStatusResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthStatusResponse extends createZodDto(
  AuthStatusResponseSchema
) {}

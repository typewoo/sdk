import { AuthRevokeResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthRevokeResponse extends createZodDto(
  AuthRevokeResponseSchema
) {}

import { AuthRevokeRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthRevokeRequest extends createZodDto(
  AuthRevokeRequestSchema
) {}

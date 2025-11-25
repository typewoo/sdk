import { AuthRevokeRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthRevokeRequest extends createZodDto(
  AuthRevokeRequestSchema
) {}

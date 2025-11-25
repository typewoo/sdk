import { AuthRevokeResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthRevokeResponse extends createZodDto(
  AuthRevokeResponseSchema
) {}

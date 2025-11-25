import { AuthRefreshRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthRefreshRequest extends createZodDto(
  AuthRefreshRequestSchema
) {}

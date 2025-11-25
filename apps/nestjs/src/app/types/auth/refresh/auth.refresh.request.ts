import { AuthRefreshRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthRefreshRequest extends createZodDto(
  AuthRefreshRequestSchema
) {}

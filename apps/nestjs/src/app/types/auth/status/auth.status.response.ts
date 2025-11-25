import { AuthStatusResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthStatusResponse extends createZodDto(
  AuthStatusResponseSchema
) {}

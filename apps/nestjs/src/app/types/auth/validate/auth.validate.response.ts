import { AuthValidateResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthValidateResponse extends createZodDto(
  AuthValidateResponseSchema
) {}

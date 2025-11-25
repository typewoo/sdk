import { AuthValidateResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAuthValidateResponse extends createZodDto(
  AuthValidateResponseSchema
) {}

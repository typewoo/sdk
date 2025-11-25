import { createZodDto } from 'nestjs-zod';
import { ApiErrorSchema } from '@store-sdk/core';
export class ApiErrorResponse extends createZodDto(ApiErrorSchema) {}

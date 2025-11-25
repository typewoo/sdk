import { createZodDto } from 'nestjs-zod';
import { ApiErrorSchema } from '@typewoo/core';
export class ApiErrorResponse extends createZodDto(ApiErrorSchema) {}

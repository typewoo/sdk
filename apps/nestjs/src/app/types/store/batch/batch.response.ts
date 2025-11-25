import { BatchResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiBatchResponse extends createZodDto(BatchResponseSchema) {}

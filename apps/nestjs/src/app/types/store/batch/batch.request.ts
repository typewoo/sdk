import { BatchRequestItemSchema, BatchRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiBatchRequestItem extends createZodDto(BatchRequestItemSchema) {}
export class ApiBatchRequest extends createZodDto(BatchRequestSchema) {}

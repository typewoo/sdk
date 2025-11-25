import { BatchRequestItemSchema, BatchRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiBatchRequestItem extends createZodDto(BatchRequestItemSchema) {}
export class ApiBatchRequest extends createZodDto(BatchRequestSchema) {}

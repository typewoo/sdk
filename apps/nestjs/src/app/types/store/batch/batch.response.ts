import { BatchResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiBatchResponse extends createZodDto(BatchResponseSchema) {}

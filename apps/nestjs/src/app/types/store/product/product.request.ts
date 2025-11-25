import { ProductRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductRequest extends createZodDto(ProductRequestSchema) {}

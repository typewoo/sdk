import { ProductResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductResponse extends createZodDto(ProductResponseSchema) {}

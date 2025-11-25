import { ProductResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductResponse extends createZodDto(ProductResponseSchema) {}

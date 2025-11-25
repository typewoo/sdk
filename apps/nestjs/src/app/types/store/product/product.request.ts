import { ProductRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductRequest extends createZodDto(ProductRequestSchema) {}

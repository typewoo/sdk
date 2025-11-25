import { ProductTagRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductTagRequest extends createZodDto(
  ProductTagRequestSchema
) {}

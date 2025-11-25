import { ProductTagRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductTagRequest extends createZodDto(
  ProductTagRequestSchema
) {}

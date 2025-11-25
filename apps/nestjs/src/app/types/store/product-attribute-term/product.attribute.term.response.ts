import { ProductAttributeTermResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductAttributeTermResponse extends createZodDto(
  ProductAttributeTermResponseSchema
) {}

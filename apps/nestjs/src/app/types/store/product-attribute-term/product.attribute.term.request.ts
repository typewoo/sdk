import { ProductAttributeTermRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductAttributeTermRequest extends createZodDto(
  ProductAttributeTermRequestSchema
) {}

import { ProductAttributeTermRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductAttributeTermRequest extends createZodDto(
  ProductAttributeTermRequestSchema
) {}

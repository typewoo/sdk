import { ProductAttributeTermResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductAttributeTermResponse extends createZodDto(
  ProductAttributeTermResponseSchema
) {}

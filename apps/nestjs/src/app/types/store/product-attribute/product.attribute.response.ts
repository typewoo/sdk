import { ProductAttributeResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductAttributeResponse extends createZodDto(
  ProductAttributeResponseSchema
) {}

import { ProductAttributeResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductAttributeResponse extends createZodDto(
  ProductAttributeResponseSchema
) {}

import { ProductTagResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductTagResponse extends createZodDto(
  ProductTagResponseSchema
) {}

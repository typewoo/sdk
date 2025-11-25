import { ProductTagResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductTagResponse extends createZodDto(
  ProductTagResponseSchema
) {}

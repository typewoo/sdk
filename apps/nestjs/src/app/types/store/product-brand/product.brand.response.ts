import { ProductBrandResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductBrandResponse extends createZodDto(
  ProductBrandResponseSchema
) {}

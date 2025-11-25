import { ProductCollectionDataResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataResponse extends createZodDto(
  ProductCollectionDataResponseSchema
) {}

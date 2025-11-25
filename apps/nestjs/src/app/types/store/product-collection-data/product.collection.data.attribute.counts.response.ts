import { ProductCollectionDataAttributeCountsResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataAttributeCountsResponse extends createZodDto(
  ProductCollectionDataAttributeCountsResponseSchema
) {}

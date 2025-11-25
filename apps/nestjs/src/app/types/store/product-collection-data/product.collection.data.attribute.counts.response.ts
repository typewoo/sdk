import { ProductCollectionDataAttributeCountsResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataAttributeCountsResponse extends createZodDto(
  ProductCollectionDataAttributeCountsResponseSchema
) {}

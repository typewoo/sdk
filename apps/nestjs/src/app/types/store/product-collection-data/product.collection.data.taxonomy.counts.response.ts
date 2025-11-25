import { ProductCollectionDataTaxonomyCountsResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataTaxonomyCountsResponse extends createZodDto(
  ProductCollectionDataTaxonomyCountsResponseSchema
) {}

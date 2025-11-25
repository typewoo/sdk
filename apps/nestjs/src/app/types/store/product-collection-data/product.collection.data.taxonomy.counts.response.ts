import { ProductCollectionDataTaxonomyCountsResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataTaxonomyCountsResponse extends createZodDto(
  ProductCollectionDataTaxonomyCountsResponseSchema
) {}

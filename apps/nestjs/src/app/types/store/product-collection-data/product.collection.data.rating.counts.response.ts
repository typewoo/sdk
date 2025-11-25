import { ProductCollectionDataRatingCountsResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataRatingCountsResponse extends createZodDto(
  ProductCollectionDataRatingCountsResponseSchema
) {}

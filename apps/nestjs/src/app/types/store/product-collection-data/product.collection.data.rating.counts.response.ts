import { ProductCollectionDataRatingCountsResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataRatingCountsResponse extends createZodDto(
  ProductCollectionDataRatingCountsResponseSchema
) {}

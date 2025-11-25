import { ProductCollectionDataPriceRangeResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataPriceRangeResponse extends createZodDto(
  ProductCollectionDataPriceRangeResponseSchema
) {}

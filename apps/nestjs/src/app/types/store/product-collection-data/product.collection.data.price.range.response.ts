import { ProductCollectionDataPriceRangeResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataPriceRangeResponse extends createZodDto(
  ProductCollectionDataPriceRangeResponseSchema
) {}

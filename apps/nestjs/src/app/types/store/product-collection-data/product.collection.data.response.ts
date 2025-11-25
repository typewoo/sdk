import { ProductCollectionDataResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataResponse extends createZodDto(
  ProductCollectionDataResponseSchema
) {}

import { ProductCollectionDataRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataRequest extends createZodDto(
  ProductCollectionDataRequestSchema
) {}

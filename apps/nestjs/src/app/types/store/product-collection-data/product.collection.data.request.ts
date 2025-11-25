import { ProductCollectionDataRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductCollectionDataRequest extends createZodDto(
  ProductCollectionDataRequestSchema
) {}

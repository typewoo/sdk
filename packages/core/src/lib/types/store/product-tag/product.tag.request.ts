import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductTagRequestSchema = PaginatedSchema;

export type ProductTagRequest = z.infer<typeof ProductTagRequestSchema>;
export class ApiProductTagRequest extends createZodDto(
  ProductTagRequestSchema
) {}

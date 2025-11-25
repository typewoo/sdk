import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductTagRequestSchema = PaginatedSchema;

export type ProductTagRequest = z.infer<typeof ProductTagRequestSchema>;

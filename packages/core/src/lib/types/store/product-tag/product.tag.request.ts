import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductTagRequestSchema = PaginatedSchema.omit({
  offset: true,
}).extend({
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
});

export type ProductTagRequest = z.infer<typeof ProductTagRequestSchema>;

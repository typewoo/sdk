import { z } from 'zod';

export const PaginatedSchema = z.object({
  /**
   * Current page of the collection.
   */
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  /**
   * Maximum number of items to be returned in result set.
   * Defaults to no limit if left blank.
   */
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  /**
   * Offset the result set by a specific number of items.
   */
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
});

export type Paginated = z.infer<typeof PaginatedSchema>;

import { z } from 'zod';

export const PaginatedSchema = z.object({
  /**
   * Current page of the collection.
   */
  page: z.number().optional(),
  /**
   * Maximum number of items to be returned in result set.
   * Defaults to no limit if left blank.
   */
  per_page: z.number().optional(),
  /**
   * Offset the result set by a specific number of items.
   */
  offset: z.number().optional(),
});

export type Paginated = z.infer<typeof PaginatedSchema>;

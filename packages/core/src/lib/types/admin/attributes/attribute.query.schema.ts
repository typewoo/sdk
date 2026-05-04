import { z } from 'zod';

/**
 * Product attribute query parameters for listing
 */
export const AdminProductAttributeQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminProductAttributeQueryParams = z.infer<
  typeof AdminProductAttributeQueryParamsSchema
>;

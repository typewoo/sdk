import { z } from 'zod';

export const AdminTaxQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['id', 'order', 'priority', 'name'])
    .default('order')
    .optional()
    .describe('Sort collection by object attribute.'),
  class: z
    .enum(['standard', 'reduced-rate', 'zero-rate'])
    .optional()
    .describe('Sort by tax class.'),
});

export type AdminTaxQueryParams = z.infer<typeof AdminTaxQueryParamsSchema>;

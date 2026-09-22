import { z } from 'zod';

export const AdminTaxClassQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminTaxClassQueryParams = z.infer<
  typeof AdminTaxClassQueryParamsSchema
>;

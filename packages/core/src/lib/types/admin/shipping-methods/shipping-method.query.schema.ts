import { z } from 'zod';

export const AdminShippingMethodQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminShippingMethodQueryParams = z.infer<
  typeof AdminShippingMethodQueryParamsSchema
>;

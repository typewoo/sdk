import { z } from 'zod';

export const AdminPaymentGatewayQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminPaymentGatewayQueryParams = z.infer<
  typeof AdminPaymentGatewayQueryParamsSchema
>;

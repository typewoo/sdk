import { z } from 'zod';

export const AdminShippingMethodSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingMethod = z.infer<typeof AdminShippingMethodSchema>;

export const AdminShippingMethodQueryParamsSchema = z.looseObject({
  context: z.enum(['view']).optional(),
});

export type AdminShippingMethodQueryParams = z.infer<
  typeof AdminShippingMethodQueryParamsSchema
>;

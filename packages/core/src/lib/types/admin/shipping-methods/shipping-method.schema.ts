import { z } from 'zod';

export const AdminShippingMethodSchema = z.looseObject({
  id: z.string().describe('Method ID.'),
  title: z.string().describe('Shipping method title.'),
  description: z.string().describe('Shipping method description.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingMethod = z.infer<typeof AdminShippingMethodSchema>;

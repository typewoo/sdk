import { z } from 'zod';

export const AdminTaxClassSchema = z.looseObject({
  slug: z.string().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Tax class name.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTaxClass = z.infer<typeof AdminTaxClassSchema>;

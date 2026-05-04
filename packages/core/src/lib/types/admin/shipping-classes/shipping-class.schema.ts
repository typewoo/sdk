import { z } from 'zod';

export const AdminShippingClassSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Shipping class name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminShippingClass = z.infer<typeof AdminShippingClassSchema>;

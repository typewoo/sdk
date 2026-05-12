import { z } from 'zod';

export const ProductTagResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Term name.'),
  slug: z.string().describe('String based identifier for the term.'),
  description: z.string().describe('Term description.'),
  parent: z.number().describe('Parent term ID, if applicable.'),
  count: z
    .number()
    .describe('Number of objects (posts of any type) assigned to the term.'),
});

export type ProductTagResponse = z.infer<typeof ProductTagResponseSchema>;

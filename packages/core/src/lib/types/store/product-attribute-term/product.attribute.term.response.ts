import { z } from 'zod';

export const ProductAttributeTermResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Term name.'),
  slug: z.string().describe('String based identifier for the term.'),
  count: z
    .number()
    .describe('Number of objects (posts of any type) assigned to the term.'),
});

export type ProductAttributeTermResponse = z.infer<
  typeof ProductAttributeTermResponseSchema
>;

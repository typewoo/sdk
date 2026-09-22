import { z } from 'zod';

export const ProductAttributeTermResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Term name.'),
  slug: z.string().describe('String based identifier for the term.'),
  count: z
    .number()
    .describe('Number of objects (posts of any type) assigned to the term.'),
  description: z.string().optional().describe('Term description.'),
  parent: z.number().optional().describe('Parent term ID, if applicable.'),
  __experimentalVisual: z
    .looseObject({
      type: z.enum(['color', 'image', 'none']).optional(),
      value: z.string().optional(),
    })
    .optional()
    .describe(
      'Experimental swatch data for visual attribute terms; returned when requested with `__experimental_visual`. WooCommerce 11.1+.'
    ),
});

export type ProductAttributeTermResponse = z.infer<
  typeof ProductAttributeTermResponseSchema
>;

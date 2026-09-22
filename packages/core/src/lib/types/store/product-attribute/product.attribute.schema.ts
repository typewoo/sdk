import { z } from 'zod';

export const ProductAttributeResponseSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Attribute name.'),
  taxonomy: z.string().describe('The attribute taxonomy name.'),
  type: z.string().describe('Attribute type.'),
  order: z
    .string()
    .describe('How terms in this attribute are sorted by default.'),
  has_archives: z
    .boolean()
    .describe('If this attribute has term archive pages.'),
  count: z
    .number()
    .optional()
    .describe('Number of terms in the attribute taxonomy.'),
});

export type ProductAttributeResponse = z.infer<
  typeof ProductAttributeResponseSchema
>;

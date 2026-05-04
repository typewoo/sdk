import { z } from 'zod';

export const AdminTaxonomyTagUpdateRequestSchema = z.looseObject({
  name: z.string().optional().describe('Tag name.'),
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
});

export type AdminTaxonomyTagUpdateRequest = z.input<
  typeof AdminTaxonomyTagUpdateRequestSchema
>;

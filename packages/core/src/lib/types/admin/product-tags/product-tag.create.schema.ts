import { z } from 'zod';

export const AdminTaxonomyTagCreateRequestSchema = z.looseObject({
  name: z.string().describe('Name for the resource.'),
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

export type AdminTaxonomyTagCreateRequest = z.input<
  typeof AdminTaxonomyTagCreateRequestSchema
>;

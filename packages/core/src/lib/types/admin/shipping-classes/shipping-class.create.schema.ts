import { z } from 'zod';

export const AdminShippingClassCreateRequestSchema = z.looseObject({
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

export type AdminShippingClassCreateRequest = z.input<
  typeof AdminShippingClassCreateRequestSchema
>;

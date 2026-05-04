import { z } from 'zod';

export const AdminShippingClassUpdateRequestSchema = z.looseObject({
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
});

export type AdminShippingClassUpdateRequest = z.input<
  typeof AdminShippingClassUpdateRequestSchema
>;

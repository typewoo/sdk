import { z } from 'zod';

export const AdminTaxSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  country: z.string().optional().describe('Country ISO 3166 code.'),
  state: z.string().optional().describe('State code.'),
  postcode: z
    .string()
    .optional()
    .describe(
      "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead."
    ),
  city: z
    .string()
    .optional()
    .describe(
      "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead."
    ),
  postcodes: z
    .array(z.string())
    .optional()
    .describe('List of postcodes / ZIPs. Introduced in WooCommerce 5.3.'),
  cities: z
    .array(z.string())
    .optional()
    .describe('List of city names. Introduced in WooCommerce 5.3.'),
  rate: z.string().optional().describe('Tax rate.'),
  name: z.string().optional().describe('Tax rate name.'),
  priority: z.number().default(1).optional().describe('Tax priority.'),
  compound: z
    .boolean()
    .default(false)
    .optional()
    .describe('Whether or not this is a compound rate.'),
  shipping: z
    .boolean()
    .default(true)
    .optional()
    .describe('Whether or not this tax rate also gets applied to shipping.'),
  order: z
    .number()
    .optional()
    .describe('Indicates the order that will appear in queries.'),
  class: z
    .enum(['standard', 'reduced-rate', 'zero-rate'])
    .default('standard')
    .optional()
    .describe('Tax class.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTax = z.infer<typeof AdminTaxSchema>;

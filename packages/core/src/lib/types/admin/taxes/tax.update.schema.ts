import { z } from 'zod';

export const AdminTaxUpdateRequestSchema = z.looseObject({
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
  priority: z.number().optional().describe('Tax priority.'),
  compound: z
    .boolean()
    .optional()
    .describe('Whether or not this is a compound rate.'),
  shipping: z
    .boolean()
    .optional()
    .describe('Whether or not this tax rate also gets applied to shipping.'),
  order: z
    .number()
    .optional()
    .describe('Indicates the order that will appear in queries.'),
  class: z
    .enum(['standard', 'reduced-rate', 'zero-rate'])
    .optional()
    .describe('Tax class.'),
  id: z.number().optional().describe('Unique identifier for the resource.'),
});

export type AdminTaxUpdateRequest = z.input<typeof AdminTaxUpdateRequestSchema>;

import { z } from 'zod';

export const AdminTaxSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  country: z.string().describe('Country ISO 3166 code.'),
  state: z.string().describe('State code.'),
  postcode: z.string().describe('Postcode/ZIP, it doesn\'t support multiple values. Deprecated as of WooCommerce 5.3, \'postcodes\' should be used instead.'),
  city: z.string().describe('City name, it doesn\'t support multiple values. Deprecated as of WooCommerce 5.3, \'cities\' should be used instead.'),
  postcodes: z.array(z.string()).describe('List of postcodes / ZIPs. Introduced in WooCommerce 5.3.'),
  cities: z.array(z.string()).describe('List of city names. Introduced in WooCommerce 5.3.'),
  rate: z.string().describe('Tax rate.'),
  name: z.string().describe('Tax rate name.'),
  priority: z.number().describe('Tax priority.'),
  compound: z.boolean().describe('Whether or not this is a compound rate.'),
  shipping: z.boolean().describe('Whether or not this tax rate also gets applied to shipping.'),
  order: z.number().describe('Indicates the order that will appear in queries.'),
  class: z.enum(['standard', 'reduced-rate', 'zero-rate']).describe('Tax class.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTax = z.infer<typeof AdminTaxSchema>;

export const AdminTaxCreateRequestSchema = z.looseObject({
  country: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
  postcodes: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
  rate: z.string().optional(),
  name: z.string().optional(),
  priority: z.number().optional(),
  compound: z.boolean().optional(),
  shipping: z.boolean().optional(),
  order: z.number().optional(),
  class: z.enum(['standard', 'reduced-rate', 'zero-rate']).optional(),
});

export type AdminTaxCreateRequest = z.input<typeof AdminTaxCreateRequestSchema>;

export const AdminTaxUpdateRequestSchema = z.looseObject({
  country: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
  postcodes: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
  rate: z.string().optional(),
  name: z.string().optional(),
  priority: z.number().optional(),
  compound: z.boolean().optional(),
  shipping: z.boolean().optional(),
  order: z.number().optional(),
  class: z.enum(['standard', 'reduced-rate', 'zero-rate']).optional(),
});

export type AdminTaxUpdateRequest = z.input<typeof AdminTaxUpdateRequestSchema>;

export const AdminTaxQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z.enum(['id', 'order', 'priority']).optional(),
  class: z.enum(['standard', 'reduced-rate', 'zero-rate']).optional(),
});

export type AdminTaxQueryParams = z.infer<typeof AdminTaxQueryParamsSchema>;

export const AdminTaxClassSchema = z.looseObject({
  slug: z.string().describe('Unique identifier for the resource.'),
  name: z.string().describe('Tax class name.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTaxClass = z.infer<typeof AdminTaxClassSchema>;

/**
 * Tax class request parameters for POST /taxes/classes (create). WooCommerce
 * does not expose a PUT endpoint for tax classes — they're create/delete only.
 */
export const AdminTaxClassCreateRequestSchema = z.looseObject({
  name: z.string().describe('Tax class name.'),
});

export type AdminTaxClassCreateRequest = z.input<
  typeof AdminTaxClassCreateRequestSchema
>;
export const AdminTaxClassQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminTaxClassQueryParams = z.infer<
  typeof AdminTaxClassQueryParamsSchema
>;

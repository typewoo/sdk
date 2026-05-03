import { z } from 'zod';

export const AdminTaxSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  country: z.string().describe('Country ISO 3166 code.'),
  state: z.string().describe('State code.'),
  postcode: z
    .string()
    .describe(
      "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead."
    ),
  city: z
    .string()
    .describe(
      "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead."
    ),
  postcodes: z
    .array(z.string())
    .describe('List of postcodes / ZIPs. Introduced in WooCommerce 5.3.'),
  cities: z
    .array(z.string())
    .describe('List of city names. Introduced in WooCommerce 5.3.'),
  rate: z.string().describe('Tax rate.'),
  name: z.string().describe('Tax rate name.'),
  priority: z.number().describe('Tax priority.'),
  compound: z.boolean().describe('Whether or not this is a compound rate.'),
  shipping: z
    .boolean()
    .describe('Whether or not this tax rate also gets applied to shipping.'),
  order: z
    .number()
    .describe('Indicates the order that will appear in queries.'),
  class: z
    .enum(['standard', 'reduced-rate', 'zero-rate'])
    .describe('Tax class.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTax = z.infer<typeof AdminTaxSchema>;

export const AdminTaxCreateRequestSchema = z.looseObject({
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
});

export type AdminTaxCreateRequest = z.input<typeof AdminTaxCreateRequestSchema>;

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
});

export type AdminTaxUpdateRequest = z.input<typeof AdminTaxUpdateRequestSchema>;

export const AdminTaxQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Indicates the order that will appear in queries.'),
  orderby: z
    .enum(['id', 'order', 'priority'])
    .optional()
    .describe('Sort collection by object attribute.'),
  class: z
    .enum(['standard', 'reduced-rate', 'zero-rate'])
    .optional()
    .describe('Tax class.'),
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
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminTaxClassQueryParams = z.infer<
  typeof AdminTaxClassQueryParamsSchema
>;

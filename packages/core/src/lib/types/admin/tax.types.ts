import { z } from 'zod';

export const AdminTaxSchema = z.looseObject({
  id: z.number(),
  country: z.string(),
  state: z.string(),
  postcode: z.string(),
  city: z.string(),
  postcodes: z.array(z.string()),
  cities: z.array(z.string()),
  rate: z.string(),
  name: z.string(),
  priority: z.number(),
  compound: z.boolean(),
  shipping: z.boolean(),
  order: z.number(),
  class: z.enum(['standard', 'reduced-rate', 'zero-rate']),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTax = z.infer<typeof AdminTaxSchema>;

export const AdminTaxRequestSchema = z.looseObject({
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

export type AdminTaxRequest = z.infer<typeof AdminTaxRequestSchema>;

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
  slug: z.string(),
  name: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTaxClass = z.infer<typeof AdminTaxClassSchema>;

export const AdminTaxClassRequestSchema = z.looseObject({
  name: z.string(),
});

export type AdminTaxClassRequest = z.infer<typeof AdminTaxClassRequestSchema>;
export const AdminTaxClassQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminTaxClassQueryParams = z.infer<
  typeof AdminTaxClassQueryParamsSchema
>;

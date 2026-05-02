import { z } from 'zod';

const AdminBrandImage = z.object({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  src: z.string(),
  name: z.string(),
  alt: z.string(),
});

export const AdminBrandSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parent: z.number(),
  description: z.string(),
  display: z.enum(['default', 'products', 'subcategories', 'both']),
  image: AdminBrandImage.nullable(),
  menu_order: z.number(),
  count: z.number(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })).optional(),
  }),
});

export type AdminBrand = z.infer<typeof AdminBrandSchema>;

export const AdminBrandRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  parent: z.number().optional(),
  description: z.string().optional(),
  display: z.enum(['default', 'products', 'subcategories', 'both']).optional(),
  image: AdminBrandImage.optional(),
  menu_order: z.number().optional(),
});

export type AdminBrandRequest = z.infer<typeof AdminBrandRequestSchema>;

export const AdminBrandQueryParamsSchema = z.looseObject({
  /**
   * Scope under which the request is made; determines fields present in response.
   */
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z
    .enum([
      'id',
      'include',
      'name',
      'slug',
      'term_group',
      'description',
      'count',
    ])
    .optional(),
  hide_empty: z.boolean().optional(),
  parent: z.number().optional(),
  product: z.number().optional(),
  slug: z.string().optional(),
});

export type AdminBrandQueryParams = z.infer<typeof AdminBrandQueryParamsSchema>;

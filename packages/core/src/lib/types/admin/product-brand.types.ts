import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AdminImage } from './common.types.js';

export const AdminBrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parent: z.number(),
  description: z.string(),
  display: z.enum(['default', 'products', 'subcategories', 'both']),
  image: AdminImage.nullable(),
  menu_order: z.number(),
  count: z.number(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })).optional(),
  }),
});

export type AdminBrand = z.infer<typeof AdminBrandSchema>;
export class ApiAdminBrand extends createZodDto(AdminBrandSchema) {}

export const AdminBrandRequestSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  parent: z.number().optional(),
  description: z.string().optional(),
  display: z.enum(['default', 'products', 'subcategories', 'both']).optional(),
  image: AdminImage.optional(),
  menu_order: z.number().optional(),
});

export type AdminBrandRequest = z.infer<typeof AdminBrandRequestSchema>;
export class ApiAdminBrandRequest extends createZodDto(
  AdminBrandRequestSchema
) {}

export const AdminBrandQueryParamsSchema = z.object({
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
export class ApiAdminBrandQueryParams extends createZodDto(
  AdminBrandQueryParamsSchema
) {}

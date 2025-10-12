import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * WooCommerce REST API Product Attribute Response
 */
export const AdminProductAttributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(['select']),
  order_by: z.enum(['menu_order', 'name', 'name_num', 'id']),
  has_archives: z.boolean(),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductAttribute = z.infer<typeof AdminProductAttributeSchema>;
export class ApiAdminProductAttribute extends createZodDto(
  AdminProductAttributeSchema
) {}

/**
 * Product attribute request parameters for creating/updating
 */
export const AdminProductAttributeRequestSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['select']).optional(),
  order_by: z.enum(['menu_order', 'name', 'name_num', 'id']).optional(),
  has_archives: z.boolean().optional(),
});

export type AdminProductAttributeRequest = z.infer<
  typeof AdminProductAttributeRequestSchema
>;
export class ApiAdminProductAttributeRequest extends createZodDto(
  AdminProductAttributeRequestSchema
) {}

/**
 * Product attribute query parameters for listing
 */
export const AdminProductAttributeQueryParamsSchema = z.object({
  /**
   * Scope under which the request is made; determines fields present in response. Options: `view` and `edit`. Default is `view`.
   */
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminProductAttributeQueryParams = z.infer<
  typeof AdminProductAttributeQueryParamsSchema
>;
export class ApiAdminProductAttributeQueryParams extends createZodDto(
  AdminProductAttributeQueryParamsSchema
) {}

/**
 * WooCommerce REST API Product Attribute Term Response
 */
export const AdminProductAttributeTermSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  menu_order: z.number(),
  count: z.number(),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductAttributeTerm = z.infer<
  typeof AdminProductAttributeTermSchema
>;
export class ApiAdminProductAttributeTerm extends createZodDto(
  AdminProductAttributeTermSchema
) {}

/**
 * Product attribute term request parameters for creating/updating
 */
export const AdminProductAttributeTermRequestSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  menu_order: z.number().optional(),
});

export type AdminProductAttributeTermRequest = z.infer<
  typeof AdminProductAttributeTermRequestSchema
>;
export class ApiAdminProductAttributeTermRequest extends createZodDto(
  AdminProductAttributeTermRequestSchema
) {}

/**
 * Product attribute term query parameters for listing
 */
export const AdminProductAttributeTermQueryParamsSchema = z.object({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
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

export type AdminProductAttributeTermQueryParams = z.infer<
  typeof AdminProductAttributeTermQueryParamsSchema
>;
export class ApiAdminProductAttributeTermQueryParams extends createZodDto(
  AdminProductAttributeTermQueryParamsSchema
) {}

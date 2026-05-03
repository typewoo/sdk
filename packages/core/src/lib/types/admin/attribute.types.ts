import { z } from 'zod';

/**
 * WooCommerce REST API Product Attribute Response
 */
export const AdminProductAttributeSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Attribute name.'),
  slug: z.string().describe('An alphanumeric identifier for the resource unique to its type.'),
  type: z.enum(['select']).describe('Type of attribute.'),
  order_by: z.enum(['menu_order', 'name', 'name_num', 'id']).describe('Default sort order.'),
  has_archives: z.boolean().describe('Enable/Disable attribute archives.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});
export type AdminProductAttribute = z.infer<typeof AdminProductAttributeSchema>;

/**
 * Product attribute request parameters for POST /products/attributes (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminProductAttributeCreateRequestSchema = z.looseObject({
  name: z.string().describe('Attribute name.'),
  slug: z.string().optional(),
  type: z.enum(['select']).optional(),
  order_by: z.enum(['menu_order', 'name', 'name_num', 'id']).optional(),
  has_archives: z.boolean().optional(),
});

export type AdminProductAttributeCreateRequest = z.input<
  typeof AdminProductAttributeCreateRequestSchema
>;

/**
 * Product attribute request parameters for PUT /products/attributes/{id}.
 */
export const AdminProductAttributeUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['select']).optional(),
  order_by: z.enum(['menu_order', 'name', 'name_num', 'id']).optional(),
  has_archives: z.boolean().optional(),
});

export type AdminProductAttributeUpdateRequest = z.input<
  typeof AdminProductAttributeUpdateRequestSchema
>;

/**
 * Product attribute query parameters for listing
 */
export const AdminProductAttributeQueryParamsSchema = z.looseObject({
  /**
   * Scope under which the request is made; determines fields present in response. Options: `view` and `edit`. Default is `view`.
   */
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminProductAttributeQueryParams = z.infer<
  typeof AdminProductAttributeQueryParamsSchema
>;

/**
 * WooCommerce REST API Product Attribute Term Response
 */
export const AdminProductAttributeTermSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Term name.'),
  slug: z.string().describe('An alphanumeric identifier for the resource unique to its type.'),
  description: z.string().describe('HTML description of the resource.'),
  menu_order: z.number().describe('Menu order, used to custom sort the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
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

/**
 * Product attribute term request parameters for POST .../terms (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminProductAttributeTermCreateRequestSchema = z.looseObject({
  name: z.string().describe('Term name.'),
  slug: z.string().optional(),
  description: z.string().optional(),
  menu_order: z.number().optional(),
});

export type AdminProductAttributeTermCreateRequest = z.input<
  typeof AdminProductAttributeTermCreateRequestSchema
>;

/**
 * Product attribute term request parameters for PUT .../terms/{id}.
 */
export const AdminProductAttributeTermUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  menu_order: z.number().optional(),
});

export type AdminProductAttributeTermUpdateRequest = z.input<
  typeof AdminProductAttributeTermUpdateRequestSchema
>;

/**
 * Product attribute term query parameters for listing
 */
export const AdminProductAttributeTermQueryParamsSchema = z.looseObject({
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

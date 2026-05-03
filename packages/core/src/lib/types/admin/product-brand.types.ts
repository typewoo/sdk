import { z } from 'zod';

const AdminBrandImage = z.object({
  id: z.number().describe('Unique identifier for the resource.'),
  date_created: z
    .string()
    .describe("The date the image was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the image was created, as GMT.'),
  date_modified: z
    .string()
    .describe("The date the image was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .describe('The date the image was last modified, as GMT.'),
  src: z.string().describe('Image URL.'),
  name: z.string().describe('Category name.'),
  alt: z.string().describe('Image alternative text.'),
});

export const AdminBrandSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Category name.'),
  slug: z
    .string()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  parent: z.number().describe('The ID for the parent of the resource.'),
  description: z.string().describe('HTML description of the resource.'),
  display: z
    .enum(['default', 'products', 'subcategories', 'both'])
    .describe('Category archive display type.'),
  image: AdminBrandImage.nullable().describe('Image data.'),
  menu_order: z
    .number()
    .describe('Menu order, used to custom sort the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })).optional(),
  }),
});

export type AdminBrand = z.infer<typeof AdminBrandSchema>;

/**
 * Brand request parameters for POST /products/brands. `name` is required.
 */
export const AdminBrandCreateRequestSchema = z.looseObject({
  name: z.string().describe('Brand name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  parent: z
    .number()
    .optional()
    .describe('The ID for the parent of the resource.'),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  display: z
    .enum(['default', 'products', 'subcategories', 'both'])
    .optional()
    .describe('Category archive display type.'),
  image: AdminBrandImage.optional().describe('Image data.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
});

export type AdminBrandCreateRequest = z.input<
  typeof AdminBrandCreateRequestSchema
>;

/**
 * Brand request parameters for PUT /products/brands/{id}.
 */
export const AdminBrandUpdateRequestSchema = z.looseObject({
  name: z.string().optional().describe('Category name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  parent: z
    .number()
    .optional()
    .describe('The ID for the parent of the resource.'),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  display: z
    .enum(['default', 'products', 'subcategories', 'both'])
    .optional()
    .describe('Category archive display type.'),
  image: AdminBrandImage.optional().describe('Image data.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
});

export type AdminBrandUpdateRequest = z.input<
  typeof AdminBrandUpdateRequestSchema
>;

export const AdminBrandQueryParamsSchema = z.looseObject({
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
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  exclude: z
    .array(z.number())
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .optional()
    .describe('Limit result set to specific ids.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
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
    .optional()
    .describe('Sort collection by resource attribute.'),
  hide_empty: z
    .boolean()
    .optional()
    .describe('Whether to hide resources not assigned to any products.'),
  parent: z
    .number()
    .optional()
    .describe('The ID for the parent of the resource.'),
  product: z
    .number()
    .optional()
    .describe('Limit result set to resources assigned to a specific product.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
});

export type AdminBrandQueryParams = z.infer<typeof AdminBrandQueryParamsSchema>;

import { z } from 'zod';

const AdminCustomerMetaData = z.object({
  id: z.number(),
  key: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), z.unknown()),
    z.null(),
  ]),
});

const AdminCustomerAddress = z.object({
  first_name: z.string(),
  last_name: z.string(),
  company: z.string(),
  address_1: z.string(),
  address_2: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  country: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * WooCommerce REST API Customer Response
 */
export const AdminCustomerSchema = z.looseObject({
  /**
   * Unique identifier for the resource.
   */
  id: z.number(),
  /**
   * The date the customer was created, in the site's timezone.
   */
  date_created: z.string(),
  /**
   * The date the customer was created, as GMT.
   */
  date_created_gmt: z.string(),
  /**
   * The date the customer was last modified, in the site's timezone.
   * Can be null for customers that have never been modified after creation.
   */
  date_modified: z.string().nullable(),
  /**
   * The date the customer was last modified, as GMT.
   * Can be null for customers that have never been modified after creation.
   */
  date_modified_gmt: z.string().nullable(),
  /**
   * The email address for the customer.
   */
  email: z.string(),
  /**
   * Customer first name.
   */
  first_name: z.string(),
  /**
   * Customer last name.
   */
  last_name: z.string(),
  /**
   * Customer role.
   */
  role: z.string(),
  /**
   * Customer login name.
   */
  username: z.string(),
  billing: AdminCustomerAddress,
  shipping: AdminCustomerAddress.omit({ email: true, phone: true }),
  is_paying_customer: z.boolean(),
  avatar_url: z.string(),
  meta_data: z.array(AdminCustomerMetaData),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminCustomer = z.infer<typeof AdminCustomerSchema>;

/**
 * Customer request parameters for creating/updating
 */
export const AdminCustomerRequestSchema = z.looseObject({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  billing: AdminCustomerAddress.optional(),
  shipping: AdminCustomerAddress.omit({ email: true, phone: true }).optional(),
  meta_data: z.array(AdminCustomerMetaData).optional(),
});

export type AdminCustomerRequest = z.infer<typeof AdminCustomerRequestSchema>;

/**
 * Customer query parameters for listing
 */
export const AdminCustomerQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z.enum(['id', 'include', 'name', 'registered_date']).optional(),
  email: z.string().optional(),
  role: z
    .enum([
      'all',
      'administrator',
      'editor',
      'author',
      'contributor',
      'subscriber',
      'customer',
      'shop_manager',
    ])
    .optional(),
});

export type AdminCustomerQueryParams = z.infer<
  typeof AdminCustomerQueryParamsSchema
>;

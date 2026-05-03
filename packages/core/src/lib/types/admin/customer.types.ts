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
  first_name: z.string().describe('First name.'),
  last_name: z.string().describe('Last name.'),
  company: z.string().describe('Company name.'),
  address_1: z.string().describe('Address line 1'),
  address_2: z.string().describe('Address line 2'),
  city: z.string().describe('City name.'),
  state: z.string().describe('ISO code or name of the state, province or district.'),
  postcode: z.string().describe('Postal code.'),
  country: z.string().describe('ISO code of the country.'),
  email: z.string().optional().describe('Email address.'),
  phone: z.string().optional().describe('Phone number.'),
});

/**
 * WooCommerce REST API Customer Response
 */
export const AdminCustomerSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  date_created: z.string().describe('The date the customer was created, in the site\'s timezone.'),
  date_created_gmt: z.string().describe('The date the customer was created, as GMT.'),
  date_modified: z.string().nullable().describe('The date the customer was last modified, in the site\'s timezone.'),
  date_modified_gmt: z.string().nullable().describe('The date the customer was last modified, as GMT.'),
  email: z.string().describe('The email address for the customer.'),
  /**
   * Customer first name.
   */
  first_name: z.string().describe('Customer first name.'),
  /**
   * Customer last name.
   */
  last_name: z.string().describe('Customer last name.'),
  /**
   * Customer role.
   */
  role: z.string().describe('Customer role.'),
  /**
   * Customer login name.
   */
  username: z.string().describe('Customer login name.'),
  billing: AdminCustomerAddress,
  shipping: AdminCustomerAddress.omit({ email: true, phone: true }).describe('List of billing address data.'),
  is_paying_customer: z.boolean().describe('Is the customer a paying customer?'),
  avatar_url: z.string().describe('Avatar URL.'),
  meta_data: z.array(AdminCustomerMetaData).describe('Meta data.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminCustomer = z.infer<typeof AdminCustomerSchema>;

/**
 * Customer request parameters for POST /customers (create). `email` is the
 * only field required by upstream WooCommerce when creating a customer.
 */
export const AdminCustomerCreateRequestSchema = z.looseObject({
  email: z.string().describe('The email address for the customer.'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  billing: AdminCustomerAddress.optional(),
  shipping: AdminCustomerAddress.omit({ email: true, phone: true }).optional(),
  meta_data: z.array(AdminCustomerMetaData).optional(),
});

export type AdminCustomerCreateRequest = z.input<
  typeof AdminCustomerCreateRequestSchema
>;

/**
 * Customer request parameters for PUT /customers/{id} (update). All fields
 * optional; `username` is omitted because WooCommerce ignores it on update.
 */
export const AdminCustomerUpdateRequestSchema = z.looseObject({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  password: z.string().optional(),
  billing: AdminCustomerAddress.optional(),
  shipping: AdminCustomerAddress.omit({ email: true, phone: true }).optional(),
  meta_data: z.array(AdminCustomerMetaData).optional(),
});

export type AdminCustomerUpdateRequest = z.input<
  typeof AdminCustomerUpdateRequestSchema
>;

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

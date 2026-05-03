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
  state: z
    .string()
    .describe('ISO code or name of the state, province or district.'),
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
  date_created: z
    .string()
    .describe("The date the customer was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the customer was created, as GMT.'),
  date_modified: z
    .string()
    .nullable()
    .describe(
      "The date the customer was last modified, in the site's timezone."
    ),
  date_modified_gmt: z
    .string()
    .nullable()
    .describe('The date the customer was last modified, as GMT.'),
  email: z.string().describe('The email address for the customer.'),
  first_name: z.string().describe('Customer first name.'),
  last_name: z.string().describe('Customer last name.'),
  role: z.string().describe('Customer role.'),
  username: z.string().describe('Customer login name.'),
  billing: AdminCustomerAddress.describe('List of billing address data.'),
  shipping: AdminCustomerAddress.omit({ email: true, phone: true }).describe(
    'List of billing address data.'
  ),
  is_paying_customer: z
    .boolean()
    .describe('Is the customer a paying customer?'),
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
  first_name: z.string().optional().describe('Customer first name.'),
  last_name: z.string().optional().describe('Customer last name.'),
  username: z.string().optional().describe('New user username.'),
  password: z.string().optional().describe('New user password.'),
  billing: AdminCustomerAddress.optional().describe(
    'List of billing address data.'
  ),
  shipping: AdminCustomerAddress.omit({ email: true, phone: true })
    .optional()
    .describe('List of shipping address data.'),
  meta_data: z.array(AdminCustomerMetaData).optional().describe('Meta data.'),
});

export type AdminCustomerCreateRequest = z.input<
  typeof AdminCustomerCreateRequestSchema
>;

/**
 * Customer request parameters for PUT /customers/{id} (update). All fields
 * optional; `username` is omitted because WooCommerce ignores it on update.
 */
export const AdminCustomerUpdateRequestSchema = z.looseObject({
  email: z.string().optional().describe('The email address for the customer.'),
  first_name: z.string().optional().describe('Customer first name.'),
  last_name: z.string().optional().describe('Customer last name.'),
  password: z.string().optional().describe('New user password.'),
  billing: AdminCustomerAddress.optional().describe(
    'List of billing address data.'
  ),
  shipping: AdminCustomerAddress.omit({ email: true, phone: true })
    .optional()
    .describe('List of shipping address data.'),
  meta_data: z.array(AdminCustomerMetaData).optional().describe('Meta data.'),
});

export type AdminCustomerUpdateRequest = z.input<
  typeof AdminCustomerUpdateRequestSchema
>;

/**
 * Customer query parameters for listing
 */
export const AdminCustomerQueryParamsSchema = z.looseObject({
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
    .describe('Limit result set to specific IDs.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['id', 'include', 'name', 'registered_date'])
    .optional()
    .describe('Sort collection by object attribute.'),
  email: z
    .string()
    .optional()
    .describe('Limit result set to resources with a specific email.'),
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
    .optional()
    .describe('Limit result set to resources with a specific role.'),
});

export type AdminCustomerQueryParams = z.infer<
  typeof AdminCustomerQueryParamsSchema
>;

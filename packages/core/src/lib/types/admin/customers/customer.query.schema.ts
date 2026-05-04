import { z } from 'zod';

export const AdminCustomerQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to specific IDs.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['id', 'include', 'name', 'registered_date'])
    .default('name')
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
    .default('customer')
    .optional()
    .describe('Limit result set to resources with a specific role.'),
});

export type AdminCustomerQueryParams = z.infer<
  typeof AdminCustomerQueryParamsSchema
>;

import { z } from 'zod';

import { AdminCustomerAddress, AdminCustomerMetaData } from './customer.js';

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
    .nullish()
    .describe(
      "The date the customer was last modified, in the site's timezone."
    ),
  date_modified_gmt: z
    .string()
    .nullish()
    .describe('The date the customer was last modified, as GMT.'),
  email: z.string().optional().describe('The email address for the customer.'),
  first_name: z.string().optional().describe('Customer first name.'),
  last_name: z.string().optional().describe('Customer last name.'),
  role: z.string().describe('Customer role.'),
  username: z.string().optional().describe('Customer login name.'),
  password: z.string().optional().describe('Customer password.'),
  billing: AdminCustomerAddress.optional().describe(
    'List of billing address data.'
  ),
  shipping: AdminCustomerAddress.omit({ email: true })
    .optional()
    .describe('List of shipping address data.'),
  is_paying_customer: z
    .boolean()
    .describe('Is the customer a paying customer?'),
  avatar_url: z.string().describe('Avatar URL.'),
  meta_data: z.array(AdminCustomerMetaData).optional().describe('Meta data.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminCustomer = z.infer<typeof AdminCustomerSchema>;

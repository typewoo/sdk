import { z } from 'zod';

import { AdminCustomerAddress, AdminCustomerMetaData } from './customer.js';

export const AdminCustomerCreateRequestSchema = z.looseObject({
  email: z.string().describe('New user email address.'),
  first_name: z.string().optional().describe('Customer first name.'),
  last_name: z.string().optional().describe('Customer last name.'),
  username: z.string().optional().describe('New user username.'),
  password: z.string().optional().describe('New user password.'),
  billing: AdminCustomerAddress.optional().describe(
    'List of billing address data.'
  ),
  shipping: AdminCustomerAddress.omit({ email: true })
    .optional()
    .describe('List of shipping address data.'),
  meta_data: z.array(AdminCustomerMetaData).optional().describe('Meta data.'),
});

export type AdminCustomerCreateRequest = z.input<
  typeof AdminCustomerCreateRequestSchema
>;

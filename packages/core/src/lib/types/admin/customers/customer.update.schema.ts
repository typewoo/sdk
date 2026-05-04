import { z } from 'zod';

import { AdminCustomerAddress, AdminCustomerMetaData } from './customer.js';

export const AdminCustomerUpdateRequestSchema = z.looseObject({
  id: z.number().optional().describe('Unique identifier for the resource.'),
  email: z.string().optional().describe('The email address for the customer.'),
  first_name: z.string().optional().describe('Customer first name.'),
  last_name: z.string().optional().describe('Customer last name.'),
  username: z.string().optional().describe('Customer login name.'),
  password: z.string().optional().describe('Customer password.'),
  billing: AdminCustomerAddress.optional().describe(
    'List of billing address data.'
  ),
  shipping: AdminCustomerAddress.omit({ email: true })
    .optional()
    .describe('List of shipping address data.'),
  meta_data: z.array(AdminCustomerMetaData).optional().describe('Meta data.'),
});

export type AdminCustomerUpdateRequest = z.input<
  typeof AdminCustomerUpdateRequestSchema
>;

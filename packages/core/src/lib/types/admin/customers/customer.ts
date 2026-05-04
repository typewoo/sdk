import { z } from 'zod';

export const AdminCustomerMetaData = z.object({
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

export const AdminCustomerAddress = z.object({
  first_name: z.string().optional().describe('First name.'),
  last_name: z.string().optional().describe('Last name.'),
  company: z.string().optional().describe('Company name.'),
  address_1: z.string().optional().describe('Address line 1'),
  address_2: z.string().optional().describe('Address line 2'),
  city: z.string().optional().describe('City name.'),
  state: z
    .string()
    .optional()
    .describe('ISO code or name of the state, province or district.'),
  postcode: z.string().optional().describe('Postal code.'),
  country: z.string().optional().describe('ISO code of the country.'),
  email: z.string().optional().describe('Email address.'),
  phone: z.string().optional().describe('Phone number.'),
});

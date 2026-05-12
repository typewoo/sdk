import { z } from 'zod';

export const CartBillingResponseSchema = z.looseObject({
  first_name: z.string().describe('First name'),
  last_name: z.string().describe('Last name'),
  company: z.string().describe('Company'),
  address_1: z.string().describe('Address'),
  address_2: z.string().describe('Apartment, suite, etc.'),
  city: z.string().describe('City'),
  state: z
    .string()
    .describe(
      'State/County code, or name of the state, county, province, or district.'
    ),
  postcode: z.string().describe('Postal code'),
  country: z
    .string()
    .describe('Country/Region code in ISO 3166-1 alpha-2 format.'),
  email: z.string().describe('Email'),
  phone: z.string().describe('Phone'),
});

export type CartBillingResponse = z.infer<typeof CartBillingResponseSchema>;

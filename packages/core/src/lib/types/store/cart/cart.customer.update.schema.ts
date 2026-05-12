import { z } from 'zod';

export const CartCustomerRequestSchema = z.looseObject({
  billing_address: z
    .looseObject({
      first_name: z.string().optional().describe('First name'),
      last_name: z.string().optional().describe('Last name'),
      company: z.string().optional().describe('Company'),
      address_1: z.string().optional().describe('Address'),
      address_2: z.string().optional().describe('Apartment, suite, etc.'),
      city: z.string().optional().describe('City'),
      state: z
        .string()
        .optional()
        .describe(
          'State/County code, or name of the state, county, province, or district.'
        ),
      postcode: z.string().optional().describe('Postal code'),
      country: z
        .string()
        .optional()
        .describe('Country/Region code in ISO 3166-1 alpha-2 format.'),
      email: z.string().optional().describe('Email'),
      phone: z.string().optional().describe('Phone'),
    })
    .optional()
    .describe('Billing address.'),
  shipping_address: z
    .looseObject({
      first_name: z.string().optional().describe('First name'),
      last_name: z.string().optional().describe('Last name'),
      company: z.string().optional().describe('Company'),
      address_1: z.string().optional().describe('Address'),
      address_2: z.string().optional().describe('Apartment, suite, etc.'),
      city: z.string().optional().describe('City'),
      state: z
        .string()
        .optional()
        .describe(
          'State/County code, or name of the state, county, province, or district.'
        ),
      postcode: z.string().optional().describe('Postal code'),
      country: z
        .string()
        .optional()
        .describe('Country/Region code in ISO 3166-1 alpha-2 format.'),
      phone: z.string().optional().describe('Phone'),
    })
    .optional()
    .describe('Shipping address.'),
});

export type CartCustomerRequest = z.infer<typeof CartCustomerRequestSchema>;

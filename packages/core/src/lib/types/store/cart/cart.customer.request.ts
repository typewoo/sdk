import { z } from 'zod';

export const CartCustomerRequestSchema = z.looseObject({
  billing_address: z.looseObject({
    first_name: z.string(),
    last_name: z.string(),
    company: z.string(),
    address_1: z.string(),
    address_2: z.string(),
    city: z.string(),
    state: z.string(),
    postcode: z.string(),
    country: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  shipping_address: z.looseObject({
    first_name: z.string(),
    last_name: z.string(),
    company: z.string(),
    address_1: z.string(),
    address_2: z.string(),
    city: z.string(),
    state: z.string(),
    postcode: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
});

export type CartCustomerRequest = z.infer<typeof CartCustomerRequestSchema>;

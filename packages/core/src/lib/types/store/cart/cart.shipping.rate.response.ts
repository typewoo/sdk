import { z } from 'zod';

export const CartShippingRateResponseSchema = z.looseObject({
  package_id: z.number(),
  name: z.string(),
  destination: z.looseObject({
    address_1: z.string(),
    address_2: z.string(),
    city: z.string(),
    state: z.string(),
    postcode: z.string(),
    country: z.string(),
  }),
  items: z.array(
    z.looseObject({
      key: z.string(),
      name: z.string(),
      quantity: z.number(),
    }),
  ),
  shipping_rates: z.array(
    z.looseObject({
      rate_id: z.string(),
      name: z.string(),
      description: z.string(),
      delivery_time: z.string(),
      price: z.string(),
      taxes: z.string(),
      instance_id: z.number(),
      method_id: z.string(),
      meta_data: z.array(
        z.looseObject({
          key: z.string(),
          value: z.string(),
        }),
      ),
      selected: z.boolean(),
      currency_code: z.string(),
      currency_symbol: z.string(),
      currency_minor_unit: z.number(),
      currency_decimal_separator: z.string(),
      currency_thousand_separator: z.string(),
      currency_prefix: z.string(),
      currency_suffix: z.string(),
    }),
  ),
});

export type CartShippingRateResponse = z.infer<
  typeof CartShippingRateResponseSchema
>;

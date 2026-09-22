import { z } from 'zod';

const LinksSchema = z.object({
  self: z.array(z.object({ href: z.string() })),
  collection: z.array(z.object({ href: z.string() })),
});

/**
 * State code. WC declares a string, but PHP turns numeric array keys into
 * integers, so some states (e.g. the US Minor Outlying Islands) come back as
 * numbers.
 */
const StateCodeSchema = z
  .union([z.string(), z.number()])
  .describe('State code.');

const StateSchema = z.object({
  code: StateCodeSchema,
  name: z.string().describe('Full name of state.'),
});

export const AdminCountrySchema = z.looseObject({
  code: z.string().describe('ISO3166 alpha-2 country code.'),
  name: z.string().describe('Full name of country.'),
  states: z.array(StateSchema).describe('List of states in this country.'),
  _links: LinksSchema,
});

export type AdminCountry = z.infer<typeof AdminCountrySchema>;

export const AdminCurrencySchema = z.looseObject({
  code: z.string().describe('ISO4217 currency code.'),
  name: z.string().describe('Full name of currency.'),
  symbol: z.string().describe('Currency symbol.'),
  _links: LinksSchema,
});

export type AdminCurrency = z.infer<typeof AdminCurrencySchema>;

export const AdminContinentSchema = z.looseObject({
  code: z.string().describe('2 character continent code.'),
  name: z.string().describe('Full name of continent.'),
  // The locale fields (currency_code … weight_unit) are only present for
  // countries WC has locale info for; e.g. Antarctica (AQ) has none.
  countries: z
    .array(
      z.object({
        code: z.string().describe('ISO3166 alpha-2 country code.'),
        name: z.string().describe('Full name of country.'),
        currency_code: z
          .string()
          .optional()
          .describe('Default ISO4127 alpha-3 currency code for the country.'),
        currency_pos: z
          .string()
          .optional()
          .describe('Currency symbol position for this country.'),
        decimal_sep: z
          .string()
          .optional()
          .describe('Decimal separator for displayed prices for this country.'),
        dimension_unit: z
          .string()
          .optional()
          .describe('The unit lengths are defined in for this country.'),
        num_decimals: z
          .number()
          .optional()
          .describe(
            'Number of decimal points shown in displayed prices for this country.'
          ),
        thousand_sep: z
          .string()
          .optional()
          .describe(
            'Thousands separator for displayed prices in this country.'
          ),
        weight_unit: z
          .string()
          .optional()
          .describe('The unit weights are defined in for this country.'),
        states: z
          .array(StateSchema)
          .describe('List of states in this country.'),
      })
    )
    .describe('List of countries on this continent.'),
  _links: LinksSchema,
});

export type AdminContinent = z.infer<typeof AdminContinentSchema>;

/**
 * Query parameters for the data endpoints. WC declares none: the data
 * controllers always respond in the `view` context and ignore `context`.
 */
export const AdminDataQueryParamsSchema = z.looseObject({});

export type AdminDataQueryParams = z.input<typeof AdminDataQueryParamsSchema>;

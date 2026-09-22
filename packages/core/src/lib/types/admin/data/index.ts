import { schemaRegistry } from '../../schema-registry.js';
import {
  AdminContinentSchema,
  AdminCountrySchema,
  AdminCurrencySchema,
  AdminDataQueryParamsSchema,
} from './data.schema.js';

// PHP turns numeric state keys into integers, so a few state codes (e.g. the
// US Minor Outlying Islands: 81, 84, …) are numbers, not the declared string.
const NUMERIC_STATE_CODE = {
  reason: 'Numeric state keys are returned as integers (e.g. UM states).',
};

schemaRegistry.add(AdminContinentSchema, {
  surface: 'admin',
  route: '/wc/v3/data/continents',
  kind: 'response',
  alsoAt: ['/wc/v3/data/continents/(?P<location>[\\w-]+)'],
  knownSchemaBugs: [
    { field: 'countries[].states[].code', ...NUMERIC_STATE_CODE },
  ],
});
schemaRegistry.add(AdminCountrySchema, {
  surface: 'admin',
  route: '/wc/v3/data/countries',
  kind: 'response',
  alsoAt: ['/wc/v3/data/countries/(?P<location>[\\w-]+)'],
  knownSchemaBugs: [{ field: 'states[].code', ...NUMERIC_STATE_CODE }],
});
schemaRegistry.add(AdminCurrencySchema, {
  surface: 'admin',
  route: '/wc/v3/data/currencies',
  kind: 'response',
  alsoAt: [
    '/wc/v3/data/currencies/(?P<currency>[\\w-]{3})',
    '/wc/v3/data/currencies/current',
  ],
});
schemaRegistry.add(AdminDataQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/data/countries',
  kind: 'query',
  method: 'GET',
  alsoAt: [
    '/wc/v3/data/countries/(?P<location>[\\w-]+)',
    '/wc/v3/data/continents',
    '/wc/v3/data/continents/(?P<location>[\\w-]+)',
    '/wc/v3/data/currencies',
    '/wc/v3/data/currencies/current',
  ],
  // WC documents a `continent` arg on the single-continent route, but the
  // code is read from the `location` path segment; the arg is never used.
  knownSchemaBugs: [
    {
      field: 'continent',
      reason: 'Unused arg; the continent code comes from the URL path.',
      driftKinds: ['missing-in-sdk'],
    },
  ],
});

export * from './data.schema.js';

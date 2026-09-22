import { schemaRegistry } from '../../schema-registry.js';
import {
  AdminSystemStatusSchema,
  AdminSystemStatusQueryParamsSchema,
} from './system-status.schema.js';

schemaRegistry.add(AdminSystemStatusSchema, {
  surface: 'admin',
  route: '/wc/v3/system_status',
  kind: 'response',
  // Returned by the controller but missing from its schema.
  undocumented: [
    // null until wp_using_ext_object_cache() has been set up.
    'environment.external_object_cache',
    'database.database_size',
    'theme.parent_version_latest',
    // WC's schema calls it `wccom_connected`, but the response key is
    // `woocommerce_com_connected`.
    'settings.woocommerce_com_connected',
  ],
  // WC's schema describes several objects as arrays of strings; the live
  // response (WC 10.7.0) sends the structures typed here.
  knownSchemaBugs: [
    {
      field: 'database.database_tables',
      reason:
        'Object of { woocommerce, other } maps of table name to { data, index, engine }, not a string array.',
      driftKinds: ['type-mismatch', 'extra-in-sdk'],
    },
    {
      field: 'dropins_mu_plugins',
      reason:
        'Object of { dropins, mu_plugins } plugin arrays, not a string array.',
      driftKinds: ['type-mismatch', 'extra-in-sdk'],
    },
    {
      field: 'theme.overrides',
      reason: 'Array of { file, version, core_version } objects, not strings.',
    },
    {
      field: 'settings.taxonomies',
      reason: 'Map of term slug to name, not a string array.',
    },
    {
      field: 'settings.product_visibility_terms',
      reason: 'Map of term slug to name, not a string array.',
    },
    {
      field: 'settings.wccom_connected',
      reason: 'Sent as `woocommerce_com_connected`.',
      driftKinds: ['missing-in-sdk'],
    },
    {
      field: 'post_type_counts',
      reason:
        'Array of { type, count } rows from a GROUP BY query, not strings.',
    },
  ],
});
schemaRegistry.add(AdminSystemStatusQueryParamsSchema, {
  surface: 'admin',
  route: '/wc/v3/system_status',
  kind: 'query',
  method: 'GET',
});

export * from './system-status.schema.js';

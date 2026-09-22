import { z } from 'zod';

const PluginSchema = z.object({
  plugin: z
    .string()
    .describe(
      'Plugin basename. The path to the main plugin file relative to the plugins directory.'
    ),
  name: z.string().describe('Name of the plugin.'),
  version: z.string().describe('Current plugin version.'),
  version_latest: z.string().describe('Latest available plugin version.'),
  url: z.string().describe('Plugin URL.'),
  author_name: z.string().describe('Plugin author name.'),
  author_url: z.string().describe('Plugin author URL.'),
  network_activated: z
    .boolean()
    .describe('Whether the plugin can only be activated network-wide.'),
});

/** Size of one database table, in MB (formatted strings). */
const DatabaseTableSchema = z.object({
  data: z.string(),
  index: z.string(),
  engine: z.string(),
});

export const AdminSystemStatusSchema = z.looseObject({
  environment: z
    .object({
      home_url: z.string().describe('Home URL.'),
      site_url: z.string().describe('Site URL.'),
      store_id: z.string().optional().describe('WooCommerce Store Identifier.'),
      version: z.string().describe('WooCommerce version.'),
      log_directory: z.string().describe('Log directory.'),
      log_directory_writable: z
        .boolean()
        .describe('Is log directory writable?'),
      wp_version: z.string().describe('WordPress version.'),
      wp_multisite: z.boolean().describe('Is WordPress multisite?'),
      wp_memory_limit: z.number().describe('WordPress memory limit.'),
      wp_debug_mode: z.boolean().describe('Is WordPress debug mode active?'),
      wp_cron: z.boolean().describe('Are WordPress cron jobs enabled?'),
      wp_environment_type: z
        .string()
        .optional()
        .describe('The WordPress environment type.'),
      language: z.string().describe('WordPress language.'),
      external_object_cache: z
        .boolean()
        .nullable()
        .describe(
          'Whether an external object cache is in use (null when unknown).'
        ),
      server_info: z.string().describe('Server info.'),
      server_architecture: z
        .string()
        .optional()
        .describe('Server architecture.'),
      php_version: z.string().describe('PHP version.'),
      php_post_max_size: z.number().describe('PHP post max size.'),
      php_max_execution_time: z.number().describe('PHP max execution time.'),
      php_max_input_vars: z.number().describe('PHP max input vars.'),
      curl_version: z.string().describe('cURL version.'),
      suhosin_installed: z.boolean().describe('Is SUHOSIN installed?'),
      max_upload_size: z.number().describe('Max upload size.'),
      mysql_version: z.string().describe('MySQL version.'),
      mysql_version_string: z.string().describe('MySQL version string.'),
      default_timezone: z.string().describe('Default timezone.'),
      fsockopen_or_curl_enabled: z
        .boolean()
        .describe('Is fsockopen/cURL enabled?'),
      soapclient_enabled: z.boolean().describe('Is SoapClient class enabled?'),
      domdocument_enabled: z
        .boolean()
        .describe('Is DomDocument class enabled?'),
      gzip_enabled: z.boolean().describe('Is GZip enabled?'),
      mbstring_enabled: z.boolean().describe('Is mbstring enabled?'),
      remote_post_successful: z.boolean().describe('Remote POST successful?'),
      remote_post_response: z.string().describe('Remote POST response.'),
      remote_get_successful: z.boolean().describe('Remote GET successful?'),
      remote_get_response: z.string().describe('Remote GET response.'),
    })
    .describe('Environment.'),
  database: z
    .object({
      wc_database_version: z.string().describe('WC database version.'),
      database_prefix: z.string().describe('Database prefix.'),
      maxmind_geoip_database: z.string().describe('MaxMind GeoIP database.'),
      database_tables: z
        .object({
          woocommerce: z.record(z.string(), DatabaseTableSchema),
          other: z.record(z.string(), DatabaseTableSchema),
        })
        .describe('Database tables.'),
      database_size: z
        .object({
          data: z.number(),
          index: z.number(),
        })
        .optional()
        .describe('Total size of the database tables, in MB.'),
    })
    .describe('Database.'),
  active_plugins: z.array(PluginSchema).describe('Active plugins.'),
  inactive_plugins: z.array(PluginSchema).describe('Inactive plugins.'),
  dropins_mu_plugins: z
    .object({
      dropins: z.array(
        z.object({
          plugin: z.string(),
          name: z.string(),
        })
      ),
      mu_plugins: z.array(
        z.object({
          plugin: z.string(),
          name: z.string(),
          version: z.string(),
          url: z.string(),
          author_name: z.string(),
          author_url: z.string(),
        })
      ),
    })
    .describe('Dropins & MU plugins.'),
  theme: z
    .object({
      name: z.string().describe('Theme name.'),
      version: z.string().describe('Theme version.'),
      version_latest: z.string().describe('Latest version of theme.'),
      author_url: z.string().describe('Theme author URL.'),
      is_child_theme: z.boolean().describe('Is this theme a child theme?'),
      is_block_theme: z
        .boolean()
        .optional()
        .describe('Is this theme a block theme?'),
      has_woocommerce_support: z
        .boolean()
        .describe('Does the theme declare WooCommerce support?'),
      has_woocommerce_file: z
        .boolean()
        .describe('Does the theme have a woocommerce.php file?'),
      has_outdated_templates: z
        .boolean()
        .describe('Does this theme have outdated templates?'),
      overrides: z
        .array(
          z.object({
            file: z.string(),
            version: z.string(),
            core_version: z.string(),
          })
        )
        .describe('Template overrides.'),
      parent_name: z.string().describe('Parent theme name.'),
      parent_version: z.string().describe('Parent theme version.'),
      parent_version_latest: z
        .string()
        .describe('Latest version of the parent theme.'),
      parent_author_url: z.string().describe('Parent theme author URL.'),
    })
    .describe('Theme.'),
  settings: z
    .object({
      api_enabled: z.boolean().describe('Legacy REST API enabled?'),
      force_ssl: z.boolean().describe('SSL forced?'),
      currency: z.string().describe('Currency.'),
      currency_symbol: z.string().describe('Currency symbol.'),
      currency_position: z.string().describe('Currency position.'),
      thousand_separator: z.string().describe('Thousand separator.'),
      decimal_separator: z.string().describe('Decimal separator.'),
      number_of_decimals: z.number().describe('Number of decimals.'),
      geolocation_enabled: z.boolean().describe('Geolocation enabled?'),
      taxonomies: z
        .record(z.string(), z.string())
        .describe('Taxonomy terms for product/order statuses.'),
      product_visibility_terms: z
        .record(z.string(), z.string())
        .describe('Terms in the product visibility taxonomy.'),
      woocommerce_com_connected: z
        .string()
        .describe('Is store connected to WooCommerce.com? (`yes` or `no`).'),
      enforce_approved_download_dirs: z
        .boolean()
        .describe('Enforce approved download directories?'),
      order_datastore: z.string().describe('Order datastore.'),
      HPOS_enabled: z.boolean().optional().describe('Is HPOS enabled?'),
      HPOS_sync_enabled: z
        .boolean()
        .optional()
        .describe('Is HPOS sync enabled?'),
      enabled_features: z
        .array(z.string())
        .optional()
        .describe('Enabled features.'),
    })
    .describe('Settings.'),
  security: z
    .object({
      secure_connection: z
        .boolean()
        .describe('Is the connection to your store secure?'),
      hide_errors: z.boolean().describe('Hide errors from visitors?'),
    })
    .describe('Security.'),
  pages: z
    .array(
      z.object({
        page_name: z.string(),
        page_id: z.string(),
        page_set: z.boolean(),
        page_exists: z.boolean(),
        page_visible: z.boolean(),
        shortcode: z.string(),
        block: z.string().optional(),
        shortcode_required: z.boolean(),
        shortcode_present: z.boolean(),
        block_present: z.boolean().optional(),
        block_required: z.boolean().optional(),
      })
    )
    .describe('WooCommerce pages.'),
  post_type_counts: z
    .array(
      z.object({
        type: z.string(),
        count: z.string(),
      })
    )
    .optional()
    .describe('Total post count.'),
  logging: z
    .object({
      logging_enabled: z.boolean().describe('Is logging enabled?'),
      default_handler: z.string().describe('The logging handler class.'),
      retention_period_days: z
        .number()
        .describe('The number of days log entries are retained.'),
      level_threshold: z.string().describe('Minimum severity level.'),
      log_directory_size: z.string().describe('The size of the log directory.'),
    })
    .optional()
    .describe('Logging.'),
});

export type AdminSystemStatus = z.infer<typeof AdminSystemStatusSchema>;

export const AdminSystemStatusQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminSystemStatusQueryParams = z.input<
  typeof AdminSystemStatusQueryParamsSchema
>;

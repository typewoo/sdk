import { z } from 'zod';

export const AdminSystemStatusSchema = z.looseObject({
  environment: z.object({
    home_url: z.string(),
    site_url: z.string(),
    version: z.string(),
    log_directory: z.string(),
    log_directory_writable: z.boolean(),
    wp_version: z.string(),
    wp_multisite: z.boolean(),
    wp_memory_limit: z.number(),
    wp_debug_mode: z.boolean(),
    wp_cron: z.boolean(),
    language: z.string(),
    external_object_cache: z.boolean(),
    server_info: z.string(),
    php_version: z.string(),
    php_post_max_size: z.number(),
    php_max_execution_time: z.number(),
    php_max_input_vars: z.number(),
    curl_version: z.string(),
    suhosin_installed: z.boolean(),
    max_upload_size: z.number(),
    mysql_version: z.string(),
    mysql_version_string: z.string(),
    default_timezone: z.string(),
    fsockopen_or_curl_enabled: z.boolean(),
    soapclient_enabled: z.boolean(),
    domdocument_enabled: z.boolean(),
    gzip_enabled: z.boolean(),
    mbstring_enabled: z.boolean(),
    remote_post_successful: z.boolean(),
    remote_post_response: z.string(),
    remote_get_successful: z.boolean(),
    remote_get_response: z.string(),
  }),
  database: z.object({
    wc_database_version: z.string(),
    database_prefix: z.string(),
    maxmind_geoip_database: z.string(),
    database_tables: z.record(
      z.string(),
      z.object({
        data: z.string(),
        index: z.string(),
        engine: z.string(),
      })
    ),
  }),
  active_plugins: z.array(
    z.object({
      plugin: z.string(),
      name: z.string(),
      version: z.string(),
      version_latest: z.string(),
      url: z.string(),
      author_name: z.string(),
      author_url: z.string(),
      network_activated: z.boolean(),
    })
  ),
  inactive_plugins: z.array(
    z.object({
      plugin: z.string(),
      name: z.string(),
      version: z.string(),
      version_latest: z.string(),
      url: z.string(),
      author_name: z.string(),
      author_url: z.string(),
      network_activated: z.boolean(),
    })
  ),
  dropins_mu_plugins: z.object({
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
  }),
  theme: z.object({
    name: z.string(),
    version: z.string(),
    version_latest: z.string(),
    author_url: z.string(),
    is_child_theme: z.boolean(),
    has_woocommerce_support: z.boolean(),
    has_woocommerce_file: z.boolean(),
    has_outdated_templates: z.boolean(),
    overrides: z.array(z.string()),
    parent_name: z.string(),
    parent_version: z.string(),
    parent_version_latest: z.string(),
    parent_author_url: z.string(),
  }),
  settings: z.object({
    api_enabled: z.boolean(),
    force_ssl: z.boolean(),
    currency: z.string(),
    currency_symbol: z.string(),
    currency_position: z.string(),
    thousand_separator: z.string(),
    decimal_separator: z.string(),
    number_of_decimals: z.number(),
    geolocation_enabled: z.boolean(),
    taxonomies: z.record(z.string(), z.string()),
    product_visibility_terms: z.record(z.string(), z.string()),
    woocommerce_com_connected: z.boolean(),
    enforce_approved_product_download_directories: z.boolean(),
    order_datastore: z.string(),
  }),
  security: z.object({
    secure_connection: z.boolean(),
    hide_errors: z.boolean(),
  }),
  pages: z.array(
    z.object({
      page_name: z.string(),
      page_id: z.number(),
      page_set: z.boolean(),
      page_exists: z.boolean(),
      page_visible: z.boolean(),
      shortcode: z.string(),
      shortcode_required: z.boolean(),
      shortcode_present: z.boolean(),
    })
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSystemStatus = z.infer<typeof AdminSystemStatusSchema>;

export const AdminSystemStatusQueryParamsSchema = z.looseObject({
  context: z.enum(['view']).optional(),
});

export type AdminSystemStatusQueryParams = z.infer<
  typeof AdminSystemStatusQueryParamsSchema
>;

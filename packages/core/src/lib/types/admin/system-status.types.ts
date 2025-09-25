export interface WcAdminSystemStatus {
  environment: {
    home_url: string;
    site_url: string;
    version: string;
    log_directory: string;
    log_directory_writable: boolean;
    wp_version: string;
    wp_multisite: boolean;
    wp_memory_limit: number;
    wp_debug_mode: boolean;
    wp_cron: boolean;
    language: string;
    external_object_cache: boolean;
    server_info: string;
    php_version: string;
    php_post_max_size: number;
    php_max_execution_time: number;
    php_max_input_vars: number;
    curl_version: string;
    suhosin_installed: boolean;
    max_upload_size: number;
    mysql_version: string;
    mysql_version_string: string;
    default_timezone: string;
    fsockopen_or_curl_enabled: boolean;
    soapclient_enabled: boolean;
    domdocument_enabled: boolean;
    gzip_enabled: boolean;
    mbstring_enabled: boolean;
    remote_post_successful: boolean;
    remote_post_response: string;
    remote_get_successful: boolean;
    remote_get_response: string;
  };
  database: {
    wc_database_version: string;
    database_prefix: string;
    maxmind_geoip_database: string;
    database_tables: {
      [key: string]: {
        data: string;
        index: string;
        engine: string;
      };
    };
  };
  active_plugins: Array<{
    plugin: string;
    name: string;
    version: string;
    version_latest: string;
    url: string;
    author_name: string;
    author_url: string;
    network_activated: boolean;
  }>;
  inactive_plugins: Array<{
    plugin: string;
    name: string;
    version: string;
    version_latest: string;
    url: string;
    author_name: string;
    author_url: string;
    network_activated: boolean;
  }>;
  dropins_mu_plugins: {
    dropins: Array<{
      plugin: string;
      name: string;
    }>;
    mu_plugins: Array<{
      plugin: string;
      name: string;
      version: string;
      url: string;
      author_name: string;
      author_url: string;
    }>;
  };
  theme: {
    name: string;
    version: string;
    version_latest: string;
    author_url: string;
    is_child_theme: boolean;
    has_woocommerce_support: boolean;
    has_woocommerce_file: boolean;
    has_outdated_templates: boolean;
    overrides: string[];
    parent_name: string;
    parent_version: string;
    parent_version_latest: string;
    parent_author_url: string;
  };
  settings: {
    api_enabled: boolean;
    force_ssl: boolean;
    currency: string;
    currency_symbol: string;
    currency_position: string;
    thousand_separator: string;
    decimal_separator: string;
    number_of_decimals: number;
    geolocation_enabled: boolean;
    taxonomies: {
      [key: string]: string;
    };
    product_visibility_terms: {
      [key: string]: string;
    };
    woocommerce_com_connected: boolean;
    enforce_approved_product_download_directories: boolean;
    order_datastore: string;
  };
  security: {
    secure_connection: boolean;
    hide_errors: boolean;
  };
  pages: Array<{
    page_name: string;
    page_id: number;
    page_set: boolean;
    page_exists: boolean;
    page_visible: boolean;
    shortcode: string;
    shortcode_required: boolean;
    shortcode_present: boolean;
  }>;
  _links: {
    self: Array<{ href: string }>;
  };
}

export interface WcAdminSystemStatusQueryParams {
  context?: 'view';
}

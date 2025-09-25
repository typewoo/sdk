export const GET_WP_URL = (): string =>
  process.env.WP_URL || 'http://localhost.fail';

export const GET_WP_ADMIN_USER = (): string =>
  process.env.WP_ADMIN_USER || 'fail';

export const GET_WP_ADMIN_EMAIL = (): string =>
  process.env.WP_ADMIN_EMAIL || 'email@fail.com';

export const GET_WP_ADMIN_PASSWORD = (): string =>
  process.env.WP_ADMIN_PASSWORD || 'failpassword';

export const GET_WP_ADMIN_APP_PASSWORD = (): string =>
  process.env.WP_ADMIN_APP_PASSWORD || 'failapppassword';

export const GET_WP_CUSTOMER_USER = (): string =>
  process.env.TEST_CUSTOMER_USER || 'fail';

export const GET_WP_CUSTOMER_EMAIL = (): string =>
  process.env.TEST_CUSTOMER_EMAIL || 'email@fail.com';

export const GET_WP_CUSTOMER_PASSWORD = (): string =>
  process.env.TEST_CUSTOMER_PASSWORD || 'failpassword';

// WooCommerce REST API consumer credentials for admin operations
export const GET_WC_CONSUMER_KEY = (): string =>
  process.env.WC_CONSUMER_KEY || 'fail_consumer_key';

export const GET_WC_CONSUMER_SECRET = (): string =>
  process.env.WC_CONSUMER_SECRET || 'fail_consumer_secret';

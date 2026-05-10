import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../../../../../../.env'), override: true });

export const getWpUrl = (): string =>
  process.env['WP_URL'] || 'http://localhost.fail';

export const getAdminUser = (): string =>
  process.env['WP_ADMIN_USER'] || 'fail';

export const getAdminAppPassword = (): string =>
  process.env['WP_ADMIN_APP_PASSWORD'] || 'failapppassword';

export const getConsumerKey = (): string =>
  process.env['WC_CONSUMER_KEY'] || 'fail_consumer_key';

export const getConsumerSecret = (): string =>
  process.env['WC_CONSUMER_SECRET'] || 'fail_consumer_secret';

export const getCustomerUser = (): string =>
  process.env['TEST_CUSTOMER_USER'] || 'fail';

export const getCustomerPassword = (): string =>
  process.env['TEST_CUSTOMER_PASSWORD'] || 'failpassword';

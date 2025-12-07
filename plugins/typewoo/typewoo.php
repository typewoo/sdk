<?php
/**
 * Plugin Name: TypeWoo
 * Plugin URI:  https://github.com/typewoo/sdk
 * Description: Authentication support for @typewoo/core (JWT endpoints: token, refresh, one-time, autologin, validate, revoke) enabling headless WooCommerce integrations.
 * Version: 1.0.0
 * Author: TypeWoo
 * Author URI: https://github.com/typewoo
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: typewoo
 * Requires at least: 6.3
 * Requires PHP: 8.0
 * Tested up to: 6.6
 * Tags: jwt, authentication, woocommerce, headless, api
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

// Define plugin constants.
if (!defined('TYPEWOO_VERSION')) {
	define('TYPEWOO_VERSION', '1.0.0');
}

if (!defined('TYPEWOO_PLUGIN_FILE')) {
	define('TYPEWOO_PLUGIN_FILE', __FILE__);
}

// Define default configuration constants.
$typewoo_defaults = array(
	'TYPEWOO_JWT_ACCESS_TTL' => 3600,
	'TYPEWOO_JWT_REFRESH_TTL' => 60 * 60 * 24 * 14,
	'TYPEWOO_JWT_REFRESH_MIN_TTL' => 60 * 60 * 24,
	'TYPEWOO_JWT_REFRESH_MAX_TTL' => 60 * 60 * 24 * 30,
	'TYPEWOO_JWT_ONE_TIME_TTL' => 300,
	'TYPEWOO_JWT_ONE_TIME_MIN_TTL' => 30,
	'TYPEWOO_JWT_ONE_TIME_MAX_TTL' => 900,
	'TYPEWOO_JWT_REFRESH_MAX_TOKENS' => 10,
	'TYPEWOO_JWT_REQUIRE_ONE_TIME_FOR_AUTOLOGIN' => true,
	'TYPEWOO_JWT_ENABLE_FRONT_CHANNEL' => true,
	'TYPEWOO_JWT_LEEWAY' => 1,
	'TYPEWOO_JWT_ENABLED' => true,
	'TYPEWOO_JWT_FORCE_AUTH_ENDPOINTS' => '',
	'TYPEWOO_JWT_SKIP_UNINSTALL_CLEANUP' => false,
	'TYPEWOO_JWT_CORS_ENABLE' => true,
	'TYPEWOO_JWT_CORS_ALLOWED_ORIGINS' => '*',
	'TYPEWOO_JWT_CORS_ALLOW_CREDENTIALS' => true,
	'TYPEWOO_JWT_CORS_ALLOW_METHODS' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
	'TYPEWOO_JWT_CORS_ALLOW_HEADERS' => 'Authorization, Content-Type, cart-token',

	'TYPEWOO_TRACKING_ENABLE' => true,
	'TYPEWOO_TRACKING_WHITELISTED_PARAMS' => [],
	'TYPEWOO_TRACKING_WHITELISTED_PATHS' => [],
	'TYPEWOO_TRACKING_UNSET_ON_ORDER' => true,
	'TYPEWOO_TRACKING_SESSION_KEY' => '_typewoo_tracking',
	'TYPEWOO_TRACKING_EXPIRY_TIME' => 86400, // 24 hours in seconds
	/** Example:
	 * 
	 * 'TYPEWOO_TRACKING_ADMIN_COLUMNS' => [
	 * 		[{key}, '{column name}', '{position after column}', {default value}]
	 * 		['_typewoo_source', 'SDK Source', 'order_status', 'Web']
	 * ],
	 * 
	 */
	'TYPEWOO_TRACKING_ADMIN_COLUMNS' => [
		['_typewoo_source', 'SDK Source', 'order_status', 'Web']
	],
	'TYPEWOO_TRACKING_ADMIN_COLUMNS_AFTER' => 'order_status',
);

foreach ($typewoo_defaults as $constant => $default_value) {
	if (!defined($constant)) {
		define($constant, $default_value);
	}
}
unset($typewoo_defaults);

// Determine plugin activation status.
$typewoo_flag_defined = defined('TYPEWOO_JWT_ENABLED');
$typewoo_flag_enabled = $typewoo_flag_defined ? (bool) TYPEWOO_JWT_ENABLED : true;
$typewoo_secret_defined = defined('TYPEWOO_JWT_SECRET') && 
	!empty(constant('TYPEWOO_JWT_SECRET')) && 
	constant('TYPEWOO_JWT_SECRET') !== 'change_me' && 
	constant('TYPEWOO_JWT_SECRET') !== 'CHANGE_ME';

if (!defined('TYPEWOO_JWT_PLUGIN_ACTIVE')) {
	define('TYPEWOO_JWT_PLUGIN_ACTIVE', $typewoo_flag_enabled && $typewoo_secret_defined);
}

// Clean up temporary variables.
unset($typewoo_flag_defined, $typewoo_flag_enabled, $typewoo_secret_defined);

/**
 * Returns the main instance of TypeWoo.
 *
 * @since 1.0.0
 * @return TypeWoo
 */
function TypeWoo() {
	return TypeWoo::instance();
}

// Include the main TypeWoo class.
if (!class_exists('TypeWoo', false)) {
	include_once dirname(TYPEWOO_PLUGIN_FILE) . '/includes/class-typewoo.php';
}

// Global for backwards compatibility.
$GLOBALS['typewoo'] = TypeWoo();

// Hook for final action after plugin is fully loaded.
do_action('typewoo_jwt_auth_loaded');

/**
 * Initialize Plugin Update Checker for GitHub releases.
 *
 * @since 1.0.0
 */
if (file_exists(dirname(TYPEWOO_PLUGIN_FILE) . '/plugin-update-checker/plugin-update-checker.php')) {
	require_once dirname(TYPEWOO_PLUGIN_FILE) . '/plugin-update-checker/plugin-update-checker.php';

	$typewoo_update_checker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
		'https://github.com/typewoo/sdk/',
		TYPEWOO_PLUGIN_FILE,
		'typewoo'
	);

	// Use GitHub releases for updates.
	$typewoo_update_checker->getVcsApi()->enableReleaseAssets();
}
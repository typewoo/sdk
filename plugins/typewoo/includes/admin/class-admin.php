<?php
/**
 * TypeWoo Admin
 *
 * Handles admin interface and notices.
 *
 * @since 1.0.0
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * TypeWoo Admin Class.
 *
 * @class Store_SDK_Admin
 */
class Store_SDK_Admin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize admin hooks.
	 */
	public function init() {
		add_action('admin_notices', array($this, 'show_admin_notices'));
		add_action('network_admin_notices', array($this, 'show_admin_notices'));
		add_action('user_admin_notices', array($this, 'show_admin_notices'));
	}

	/**
	 * Show admin notices for plugin configuration.
	 */
	public function show_admin_notices() {
		if (!current_user_can('manage_options')) {
			return;
		}

		$config = $this->get_plugin_config_status();
		$should_show = $this->should_show_notice($config);
		
		// Allow filtering of notice display
		$should_show = apply_filters('typewoo_jwt_show_admin_notice', $should_show, $config);
		
		if (!$should_show) {
			return;
		}

		$this->render_configuration_notice($config);
	}

	/**
	 * Get plugin configuration status.
	 *
	 * @return array
	 */
	private function get_plugin_config_status() {
		$flag_defined = defined('TYPEWOO_JWT_ENABLED');
		$flag_enabled = $flag_defined && (bool) TYPEWOO_JWT_ENABLED;
		$secret_defined = defined('TYPEWOO_JWT_SECRET') && 
			!empty(constant('TYPEWOO_JWT_SECRET')) && 
			strtolower(constant('TYPEWOO_JWT_SECRET')) !== 'change_me';
		$active = $flag_enabled && $secret_defined;
		$debug_force = defined('TYPEWOO_JWT_DEBUG_SHOW_NOTICE') && TYPEWOO_JWT_DEBUG_SHOW_NOTICE;

		return array(
			'flag_defined' => $flag_defined,
			'flag_enabled' => $flag_enabled,
			'secret_defined' => $secret_defined,
			'active' => $active,
			'debug_force' => $debug_force,
		);
	}

	/**
	 * Determine if admin notice should be shown.
	 *
	 * @param array $config Configuration status.
	 * @return bool
	 */
	private function should_show_notice($config) {
		return $config['debug_force'] || 
			!$config['active'] || 
			($config['flag_defined'] && !$config['flag_enabled']) || 
			!$config['secret_defined'] || 
			!$config['flag_defined'];
	}

	/**
	 * Render configuration notice.
	 *
	 * @param array $config Configuration status.
	 */
	private function render_configuration_notice($config) {
		$steps = $this->get_configuration_steps($config);
		
		if (empty($steps) && !$config['debug_force']) {
			return;
		}

		$title = __('TypeWoo authentication configuration', 'typewoo');
		$notice_class = $config['active'] && $config['debug_force'] ? 'notice-info' : 'notice-error';
		
		echo '<div class="notice ' . esc_attr($notice_class) . '">';
		echo '<p><strong>' . esc_html($title) . '</strong></p>';
		
		if (!empty($steps)) {
			echo '<ul style="margin-left:20px;list-style:disc;">';
			foreach ($steps as $step) {
				echo '<li>' . wp_kses_post($this->format_step_html($step)) . '</li>';
			}
			echo '</ul>';
		}
		
		if ($config['debug_force']) {
			echo '<p><em>' . esc_html__('Debug mode: This notice is shown for testing purposes.', 'typewoo') . '</em></p>';
		}
		
		echo '</div>';
	}

	/**
	 * Get configuration steps needed.
	 *
	 * @param array $config Configuration status.
	 * @return array
	 */
	private function get_configuration_steps($config) {
		$steps = array();
		
		if (!$config['flag_defined']) {
			$steps[] = array(
				'type' => 'code',
				/* translators: %s: PHP code snippet to define JWT enabled flag */
				'text' => __('Required: Add %s.', 'typewoo'),
				'code' => "define('TYPEWOO_JWT_ENABLED', true);"
			);
		}
		
		if (!$config['secret_defined']) {
			$steps[] = array(
				'type' => 'code',
				/* translators: %s: PHP code snippet to define JWT secret */
				'text' => __('Required: Add %s.', 'typewoo'),
				'code' => "define('TYPEWOO_JWT_SECRET', 'REPLACE_WITH_RANDOM_48_CHARS');"
			);
		}
		
		if ($config['flag_defined'] && !$config['flag_enabled']) {
			$steps[] = array(
				'type' => 'text',
				'text' => __('Plugin is disabled. Set TYPEWOO_JWT_ENABLED to true in wp-config.php.', 'typewoo')
			);
		}
		
		return $steps;
	}

	/**
	 * Format step HTML safely.
	 *
	 * @param array $step Step configuration.
	 * @return string
	 */
	private function format_step_html($step) {
		if ($step['type'] === 'code') {
			$code = '<code>' . esc_html($step['code']) . '</code>';
			return sprintf($step['text'], $code);
		}
		
		return esc_html($step['text']);
	}

	/**
	 * Get plugin information for display.
	 *
	 * @return array
	 */
	public function get_plugin_info() {
		return array(
			'version' => defined('TYPEWOO_VERSION') ? TYPEWOO_VERSION : '1.0.0',
			'file' => defined('TYPEWOO_PLUGIN_FILE') ? TYPEWOO_PLUGIN_FILE : __FILE__,
			'basename' => defined('TYPEWOO_PLUGIN_BASENAME') ? TYPEWOO_PLUGIN_BASENAME : plugin_basename(__FILE__),
			'path' => defined('TYPEWOO_ABSPATH') ? TYPEWOO_ABSPATH : plugin_dir_path(__FILE__),
			'url' => defined('TYPEWOO_PLUGIN_URL') ? TYPEWOO_PLUGIN_URL : plugin_dir_url(__FILE__),
		);
	}

	/**
	 * Add settings link to plugins page.
	 *
	 * @param array $links Existing links.
	 * @return array
	 */
	public function add_plugin_links($links) {
		$config = $this->get_plugin_config_status();
		
		if (!$config['active']) {
			$setup_link = '<span style="color: #d63638;">' . __('Setup Required', 'typewoo') . '</span>';
			array_unshift($links, $setup_link);
		} else {
			$status_link = '<span style="color: #00a32a;">' . __('Active', 'typewoo') . '</span>';
			array_unshift($links, $status_link);
		}
		
		return $links;
	}

	/**
	 * Get configuration recommendations.
	 *
	 * @return array
	 */
	public function get_configuration_recommendations() {
		$recommendations = array();
		
		// Check if CORS is properly configured
		if (!defined('TYPEWOO_JWT_CORS_ENABLE') || !TYPEWOO_JWT_CORS_ENABLE) {
			$recommendations[] = array(
				'level' => 'info',
				'message' => __('CORS is disabled. Enable it if you need cross-origin requests.', 'typewoo'),
				'code' => "define('TYPEWOO_JWT_CORS_ENABLE', true);"
			);
		}
		
		// Check refresh token limits
		if (!defined('TYPEWOO_JWT_REFRESH_MAX_TOKENS')) {
			$recommendations[] = array(
				'level' => 'info',
				'message' => __('Consider setting a refresh token limit to prevent abuse.', 'typewoo'),
				'code' => "define('TYPEWOO_JWT_REFRESH_MAX_TOKENS', 10);"
			);
		}
		
		// Check if forced authentication endpoints are configured
		if (!defined('TYPEWOO_JWT_FORCE_AUTH_ENDPOINTS')) {
			$recommendations[] = array(
				'level' => 'info',
				'message' => __('You can force authentication on specific endpoints.', 'typewoo'),
				'code' => "define('TYPEWOO_JWT_FORCE_AUTH_ENDPOINTS', 'wc/store/v1/cart,wc/store/v1/checkout');"
			);
		}
		
		return $recommendations;
	}
}
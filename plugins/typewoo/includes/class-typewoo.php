<?php
/**
 * The main Typewoo plugin class.
 *
 * @since 1.0.0
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Main Typewoo Class.
 *
 * @class Typewoo
 */
final class Typewoo {

	/**
	 * The single instance of the class.
	 *
	 * @var Typewoo
	 * @since 1.0.0
	 */
	protected static $_instance = null;

	/**
	 * CORS handler instance.
	 *
	 * @var Typewoo_CORS
	 */
	public $cors;

	/**
	 * JWT handler instance.
	 *
	 * @var Typewoo_JWT
	 */
	public $jwt;

	/**
	 * Auth handler instance.
	 *
	 * @var Typewoo_Auth
	 */
	public $auth;

	/**
	 * API handler instance.
	 *
	 * @var Typewoo_API
	 */
	public $api;

	/**
	 * Tracking handler instance.
	 *
	 * @var Typewoo_Tracking
	 */
	public $tracking;

	/**
	 * Admin handler instance.
	 *
	 * @var Typewoo_Admin
	 */
	public $admin;

	/**
	 * Flag to track if plugin has been initialized.
	 *
	 * @var bool
	 */
	private $initialized = false;

	/**
	 * Main Typewoo Instance.
	 *
	 * Ensures only one instance of Typewoo is loaded or can be loaded.
	 *
	 * @since 1.0.0
	 * @static
	 * @return Typewoo - Main instance.
	 */
	public static function instance() {
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Typewoo Constructor.
	 */
	public function __construct() {
		// Prevent double initialization
		if ($this->initialized) {
			return;
		}

		$this->define_constants();
		$this->includes();
		$this->init_hooks();
		
		$this->initialized = true;
		do_action('typewoo_loaded');
	}

	/**
	 * Hook into actions and filters.
	 *
	 * @since 1.0.0
	 */
	private function init_hooks() {
		register_activation_hook(TYPEWOO_PLUGIN_FILE, array($this, 'activation_check'));
		add_action('plugins_loaded', array($this, 'init'), 0);
	}

	/**
	 * Define Typewoo Constants.
	 */
	private function define_constants() {
		$this->define('TYPEWOO_ABSPATH', dirname(TYPEWOO_PLUGIN_FILE) . '/');
		$this->define('TYPEWOO_PLUGIN_BASENAME', plugin_basename(TYPEWOO_PLUGIN_FILE));
		$this->define('TYPEWOO_VERSION', '1.0.0');
	}

	/**
	 * Define constant if not already set.
	 *
	 * @param string $name  Constant name.
	 * @param string|bool $value Constant value.
	 */
	private function define($name, $value) {
		if (!defined($name)) {
			define($name, $value);
		}
	}

	/**
	 * What type of request is this?
	 *
	 * @param string $type admin, ajax, cron or frontend.
	 * @return bool
	 */
	private function is_request($type) {
		switch ($type) {
			case 'admin':
				return is_admin();
			case 'ajax':
				return defined('DOING_AJAX');
			case 'cron':
				return defined('DOING_CRON');
			case 'frontend':
				return (!is_admin() || defined('DOING_AJAX')) && !defined('DOING_CRON');
		}
	}

	/**
	 * Include required core files used in admin and on the frontend.
	 */
	public function includes() {
		/**
		 * Core classes.
		 */
		include_once TYPEWOO_ABSPATH . 'includes/class-cors.php';
		include_once TYPEWOO_ABSPATH . 'includes/class-jwt.php';
		include_once TYPEWOO_ABSPATH . 'includes/class-auth.php';
		include_once TYPEWOO_ABSPATH . 'includes/api/class-api.php';
		include_once TYPEWOO_ABSPATH . 'includes/class-tracking.php';
		
		if ($this->is_request('admin')) {
			include_once TYPEWOO_ABSPATH . 'includes/admin/class-admin.php';
		}
	}

	/**
	 * Init Typewoo when WordPress Initialises.
	 */
	public function init() {
		// Before init action.
		do_action('before_typewoo_init');

		// Set up localisation.
		$this->load_plugin_textdomain();

		// Initialize core components.
		$this->cors = new Typewoo_CORS();
		$this->jwt = new Typewoo_JWT();
		$this->auth = new Typewoo_Auth();
		$this->api = new Typewoo_API();
		$this->tracking = new Typewoo_Tracking();

		if ($this->is_request('admin')) {
			$this->admin = new Typewoo_Admin();
		}

		// Init action.
		do_action('typewoo_init');
	}

	/**
	 * Load Localisation files.
	 */
	public function load_plugin_textdomain() {
		$locale = determine_locale();
		$locale = apply_filters('plugin_locale', $locale, 'typewoo');

		unload_textdomain('typewoo');
		load_textdomain('typewoo', WP_LANG_DIR . '/typewoo/sdk-' . $locale . '.mo');
		// WordPress automatically loads plugin translations from WordPress.org since 4.6
	}

	/**
	 * Activation check.
	 */
	public function activation_check() {
		if (version_compare(PHP_VERSION, '8.0', '<')) {
			deactivate_plugins(plugin_basename(TYPEWOO_PLUGIN_FILE));
			wp_die(
				esc_html__('Typewoo requires PHP version 8.0 or above.', 'typewoo'),
				esc_html__('Plugin Activation Error', 'typewoo'),
				array('response' => 200, 'back_link' => true)
			);
		}
	}

	/**
	 * Get the plugin url.
	 *
	 * @return string
	 */
	public function plugin_url() {
		return untrailingslashit(plugins_url('/', TYPEWOO_PLUGIN_FILE));
	}

	/**
	 * Get the plugin path.
	 *
	 * @return string
	 */
	public function plugin_path() {
		return untrailingslashit(plugin_dir_path(TYPEWOO_PLUGIN_FILE));
	}
}
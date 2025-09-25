<?php
/**
 * WooCommerce REST API key creation for testing
 * Creates a consistent set of REST API keys for testing purposes
 * Always ensures the specified test keys are available
 */

// Remove any existing guard to ensure keys are always updated
delete_option( 'store_sdk_api_keys_created' );

if ( ! class_exists( 'WooCommerce' ) ) { 
    echo "WooCommerce not loaded."; 
    return; 
}

global $wpdb;

// Define test API key details
$key_description = 'Store SDK Test Keys';
$user_id = 1; // Admin user
$permissions = 'read_write'; // Full access for testing

// Use fixed consumer key and secret for consistent testing
$consumer_key = 'ck_e942af2803e6e71cd84ae0355e03800ad5ee6a44';
$consumer_secret = 'cs_ce3cfab0f8b810898821faa658a81261533c9f5b';

echo "Using fixed test keys:\n";
echo "Consumer Key: $consumer_key\n";
echo "Consumer Secret: $consumer_secret\n";

// Check if a key with this description already exists and remove it
$existing_key = $wpdb->get_row( $wpdb->prepare(
    "SELECT key_id FROM {$wpdb->prefix}woocommerce_api_keys WHERE description = %s",
    $key_description
) );

if ( $existing_key ) {
    echo "Removing existing key (ID: {$existing_key->key_id}) to ensure fresh creation...\n";
    $wpdb->delete(
        $wpdb->prefix . 'woocommerce_api_keys',
        array( 'key_id' => $existing_key->key_id ),
        array( '%d' )
    );
}

echo "Creating new API key...\n";

// Insert the new API key - use proper wp_hash for the hashed versions
$result = $wpdb->insert(
    $wpdb->prefix . 'woocommerce_api_keys',
    array(
        'user_id'         => $user_id,
        'description'     => $key_description,
        'permissions'     => $permissions,
        'consumer_key'    => wp_hash( $consumer_key ),
        'consumer_secret' => wp_hash( $consumer_secret ),
        'truncated_key'   => substr( $consumer_key, -7 ),
    ),
    array(
        '%d',
        '%s',
        '%s',
        '%s',
        '%s',
        '%s',
    )
);

if ( $result === false ) {
    echo "Failed to create REST API keys. Error: " . $wpdb->last_error . "\n";
    return;
}

echo "REST API keys inserted successfully\n";

// Store the keys in WordPress options for easy retrieval
update_option( 'store_sdk_test_consumer_key', $consumer_key );
update_option( 'store_sdk_test_consumer_secret', $consumer_secret );

echo "Keys stored in options\n";

// Write keys to a file that can be sourced by shell scripts
$keys_file = '/tmp/wc-api-keys.env';
$env_content = "WP_CONSUMER_KEY=\"$consumer_key\"\n";
$env_content .= "WP_CONSUMER_SECRET=\"$consumer_secret\"\n";
file_put_contents( $keys_file, $env_content );
chmod( $keys_file, 0644 );

// Also append WooCommerce API keys to the project root .env file
$env_file = '/var/www/html/.env';
$api_keys_content = "\n# WooCommerce REST API Keys\n";
$api_keys_content .= "WP_CONSUMER_KEY=\"$consumer_key\"\n";
$api_keys_content .= "WP_CONSUMER_SECRET=\"$consumer_secret\"\n";
file_put_contents( $env_file, $api_keys_content, FILE_APPEND );

echo "Keys written to: $keys_file\n";
echo "Keys appended to: .env\n";

// Guard option to prevent re-creation
update_option( 'store_sdk_api_keys_created', 1, true );
echo "REST API key setup complete.\n";
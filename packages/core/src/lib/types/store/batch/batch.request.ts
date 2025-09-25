/**
 * Individual batch request item
 */
export interface BatchRequestItem {
  /**
   * HTTP method for the request
   */
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  /**
   * API path for the request (relative to WooCommerce Store API)
   */
  path: string;

  /**
   * Request body data
   */
  body?: Record<string, unknown>;

  /**
   * Request headers
   */
  headers?: Record<string, string | string[]>;
}

/**
 * Batch request parameters
 */
export interface BatchRequest {
  /**
   * Validation mode for the batch request
   * - 'require-all-validate': All requests must validate before any are processed
   * - 'normal': Process requests individually
   */
  validation?: 'require-all-validate' | 'normal';

  /**
   * Array of individual requests to process
   * Maximum of 25 requests per batch
   */
  requests: BatchRequestItem[];
}

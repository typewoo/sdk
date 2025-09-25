/**
 * Individual batch response item
 */
export interface BatchResponseItem {
  /**
   * HTTP status code of the response
   */
  status: number;

  /**
   * Response headers
   */
  headers: Record<string, string>;

  /**
   * Response body data
   */
  body: unknown;
}

/**
 * Batch response from the API
 */
export interface BatchResponse {
  /**
   * Array of individual response results
   */
  responses: BatchResponseItem[];
}

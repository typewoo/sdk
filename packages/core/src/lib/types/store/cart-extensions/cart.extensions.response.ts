/**
 * Cart extensions response
 */
export interface CartExtensionsResponse {
  /**
   * Extension namespace
   */
  namespace: string;

  /**
   * Extension data that was stored
   */
  data: Record<string, unknown>;

  /**
   * Success status
   */
  success: boolean;

  /**
   * Error message if operation failed
   */
  error?: string;
}

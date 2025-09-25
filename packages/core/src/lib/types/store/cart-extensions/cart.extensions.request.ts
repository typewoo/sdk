/**
 * Cart extensions request for third-party plugin data
 */
export interface CartExtensionsRequest {
  /**
   * Extension namespace - used to ensure data is passed to the correct extension
   */
  namespace: string;

  /**
   * Extension data to be stored
   */
  data: Record<string, unknown>;
}

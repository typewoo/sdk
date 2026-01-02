import { ApiError } from '../../types/api.js';

/**
 * Options for the loop() pagination method
 */
export interface LoopOptions<T> {
  /**
   * Maximum number of pages to fetch. Defaults to Infinity.
   */
  maxPages?: number;

  /**
   * Delay in milliseconds between page requests. Defaults to 0.
   */
  delayMs?: number;

  /**
   * Whether to stop iteration on first error. Defaults to true.
   */
  stopOnError?: boolean;

  /**
   * Callback invoked after each page is fetched.
   * Useful for progress tracking or processing items as they arrive.
   */
  onPage?: (result: LoopPageResult<T>) => void | Promise<void>;

  /**
   * AbortSignal to cancel the loop operation.
   * When aborted, returns the items collected so far.
   *
   * @example
   * ```typescript
   * const controller = new AbortController();
   *
   * // Cancel after 5 seconds
   * setTimeout(() => controller.abort(), 5000);
   *
   * const { data } = await sdk.admin.products.list().loop({
   *   signal: controller.signal,
   *   onPage: ({ page }) => console.log(`Page ${page}`)
   * });
   * ```
   */
  signal?: AbortSignal;
}

/**
 * Result passed to the onPage callback for each page
 */
export interface LoopPageResult<T> {
  /** The items from this page */
  data?: T;
  /** Current page number (1-based) */
  page: number;
  /** Total pages if known */
  totalPages?: number;
  /** Total items if known */
  total?: number;
  /** Error if the request failed */
  error?: ApiError;
}

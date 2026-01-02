import { ApiPaginationResult } from '../../types/api.js';

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
   * Whether to stop iteration on first error. When false, the loop continues to the next
   * page after an error, but will still stop if a page returns no data. Defaults to true.
   */
  stopOnError?: boolean;

  /**
   * Callback invoked after each page is fetched.
   * Receives the same result type as the original list method.
   * Useful for progress tracking or processing items as they arrive.
   */
  onPage?: (result: ApiPaginationResult<T>) => void | Promise<void>;

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
   *   onPage: ({ data, pagination }) => console.log(`Total items: ${pagination.total}`)
   * });
   * ```
   */
  signal?: AbortSignal;
}

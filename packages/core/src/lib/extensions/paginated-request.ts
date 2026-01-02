import { ApiPaginationResult } from '../types/api.js';
import { loopExtension } from './loop/loop.js';
import { LoopOptions } from './loop/loop.options.js';

/**
 * A thenable paginated request that supports:
 * - `await request` - returns the first page result (backward compatible)
 * - `request.loop()` - fetches all pages and returns combined result
 *
 * This class serves as the base for paginated API requests and can be
 * extended with additional methods via the extensions system.
 *
 * @example
 * ```typescript
 * // Standard usage - fetch first page
 * const { data, pagination } = await sdk.admin.products.list({ per_page: 10 });
 *
 * // Loop through all pages
 * const { data: allProducts } = await sdk.admin.products.list({ per_page: 100 }).loop({
 *   onPage: ({ page, totalPages }) => console.log(`Page ${page}/${totalPages}`)
 * });
 * ```
 */
export class PaginatedRequest<T, TParams> {
  constructor(
    private readonly request: (
      params?: TParams
    ) => Promise<ApiPaginationResult<T>>,
    private readonly params?: TParams,
    private readonly pageParamName = 'page'
  ) {}

  /**
   * Makes this object thenable so `await request` works
   */
  then<TResult1 = ApiPaginationResult<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: ApiPaginationResult<T>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.request(this.params).then(onfulfilled, onrejected);
  }

  /**
   * Catch handler for promise compatibility
   */
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<ApiPaginationResult<T> | TResult> {
    return this.request(this.params).catch(onrejected);
  }

  /**
   * Finally handler for promise compatibility
   */
  finally(onfinally?: (() => void) | null): Promise<ApiPaginationResult<T>> {
    return this.request(this.params).finally(onfinally);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Extensions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Fetches all pages and returns a single result with all items combined.
   * Optionally calls `onPage` callback after each page is fetched.
   *
   * @example
   * ```typescript
   * // Fetch all products with progress callback
   * const { data, pagination } = await sdk.admin.products.list({ per_page: 100 }).loop({
   *   onPage: ({ data, pagination }) => {
   *     console.log(`Fetched ${data?.length} items, total: ${pagination.total}`);
   *   }
   * });
   * console.log(`Total products fetched: ${data?.length}`);
   *
   * // Simple usage - just get all items
   * const { data: allProducts } = await sdk.admin.products.list().loop();
   * ```
   */
  loop(options: LoopOptions<T> = {}): Promise<ApiPaginationResult<T>> {
    return loopExtension(
      this.request,
      this.params,
      this.pageParamName,
      options
    );
  }
}

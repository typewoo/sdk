import { ApiPaginationResult, ApiError, Pagination } from '../../types/api.js';
import { LoopOptions, LoopPageResult } from './loop.options.js';

/**
 * Loop extension function that fetches all pages and returns combined results.
 * This is the core implementation used by PaginatedRequest.loop()
 *
 * @internal
 */
export async function loopExtension<T, TParams>(
  request: (params?: TParams) => Promise<ApiPaginationResult<T>>,
  params: TParams | undefined,
  pageParamName: string,
  options: LoopOptions<T> = {}
): Promise<ApiPaginationResult<T>> {
  const {
    maxPages = Infinity,
    delayMs = 0,
    stopOnError = true,
    onPage,
    signal,
  } = options;

  const allItems: unknown[] = [];
  let lastError: ApiError | undefined;
  let totalPages: number | undefined;
  let total: number | undefined;
  let currentPage = 1;

  while (currentPage <= maxPages) {
    // Check if aborted before starting
    if (signal?.aborted) break;

    // Add delay between requests (skip first request)
    if (currentPage > 1 && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // Check again after delay
      if (signal?.aborted) break;
    }

    const pageParams = {
      ...params,
      [pageParamName]: currentPage,
    } as TParams;

    const result = await request(pageParams);

    // Update pagination info from response
    if (result.pagination?.totalPages !== undefined) {
      totalPages = result.pagination.totalPages;
    }
    if (result.pagination?.total !== undefined) {
      total = result.pagination.total;
    }

    // Call the onPage callback if provided
    if (onPage) {
      const pageResult: LoopPageResult<T> = {
        data: result.data,
        page: currentPage,
        totalPages,
        total,
        error: result.error,
      };
      await onPage(pageResult);
    }

    // Handle errors
    if (result.error) {
      lastError = result.error;
      if (stopOnError) break;
    }

    // Accumulate items
    if (result.data) {
      if (Array.isArray(result.data)) {
        // Safety: stop if we get an empty array (no more items)
        if (result.data.length === 0) break;
        allItems.push(...result.data);
      } else {
        allItems.push(result.data);
      }
    } else {
      // No data returned - stop to prevent infinite loop
      break;
    }

    // Check if we've reached the end
    const hasMorePages =
      totalPages !== undefined
        ? currentPage < totalPages
        : result.pagination?.next !== undefined;

    if (!hasMorePages) break;

    currentPage++;
  }

  const pagination: Pagination = {
    total,
    totalPages,
  };

  return {
    data: allItems as T,
    error: lastError,
    pagination,
  };
}

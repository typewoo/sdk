import { BaseService } from '../base.service.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult } from '../../types/api.js';
import {
  AnalyticsCategory,
  AnalyticsCategoriesListQueryParams,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Categories Service
 *
 * Provides category analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/categories)
 */
export class AnalyticsCategoriesService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/categories';

  /**
   * List category detail rows
   */
  list(
    params?: AnalyticsCategoriesListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsCategory[], AnalyticsCategoriesListQueryParams> {
    const request = async (
      pageParams?: AnalyticsCategoriesListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsCategory[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await this.http.get<AnalyticsCategory[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  // WooCommerce has no `reports/categories/stats` route. For category stats
  // over time, use `analytics.products.getStats({ segmentby: 'category' })`.
}

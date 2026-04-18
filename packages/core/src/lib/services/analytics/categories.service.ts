import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsCategory,
  AnalyticsCategoryStats,
  AnalyticsCategoriesStatsQueryParams,
  AnalyticsCategoriesListQueryParams,
  AnalyticsStatsResponse,
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

      const { data, error, headers } = await doGet<AnalyticsCategory[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get category statistics with time intervals
   */
  async getStats(
    params?: AnalyticsCategoriesStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsCategoryStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsCategoryStats>
    >(url, options);
    return { data, error };
  }
}

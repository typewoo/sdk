import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsProduct,
  AnalyticsProductStats,
  AnalyticsProductsStatsQueryParams,
  AnalyticsProductsListQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Products Service
 *
 * Provides product analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/products)
 */
export class AnalyticsProductsService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/products';

  /**
   * List product detail rows
   */
  list(
    params?: AnalyticsProductsListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsProduct[], AnalyticsProductsListQueryParams> {
    const request = async (
      pageParams?: AnalyticsProductsListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsProduct[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsProduct[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get product statistics with time intervals
   */
  async getStats(
    params?: AnalyticsProductsStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsProductStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsProductStats>
    >(url, options);
    return { data, error };
  }
}

import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsTax,
  AnalyticsTaxStats,
  AnalyticsTaxesStatsQueryParams,
  AnalyticsTaxesListQueryParams,
  AnalyticsStatsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Taxes Service
 *
 * Provides tax analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/taxes)
 */
export class AnalyticsTaxesService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/taxes';

  /**
   * List tax detail rows
   */
  list(
    params?: AnalyticsTaxesListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsTax[], AnalyticsTaxesListQueryParams> {
    const request = async (
      pageParams?: AnalyticsTaxesListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsTax[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsTax[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get tax statistics with time intervals
   */
  async getStats(
    params?: AnalyticsTaxesStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsStatsResponse<AnalyticsTaxStats>>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<
      AnalyticsStatsResponse<AnalyticsTaxStats>
    >(url, options);
    return { data, error };
  }
}

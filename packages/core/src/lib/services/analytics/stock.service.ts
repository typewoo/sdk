import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsStockItem,
  AnalyticsStockStats,
  AnalyticsStockListQueryParams,
  AnalyticsTotalsResponse,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Stock Service
 *
 * Provides stock analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/stock)
 */
export class AnalyticsStockService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/stock';

  /**
   * List stock items
   */
  list(
    params?: AnalyticsStockListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsStockItem[], AnalyticsStockListQueryParams> {
    const request = async (
      pageParams?: AnalyticsStockListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsStockItem[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AnalyticsStockItem[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get stock statistics (totals for in stock, out of stock, low stock, etc.)
   */
  async getStats(
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsTotalsResponse<AnalyticsStockStats>>> {
    const url = `/${this.endpoint}/stats`;

    const { data, error } = await doGet<
      AnalyticsTotalsResponse<AnalyticsStockStats>
    >(url, options);
    return { data, error };
  }
}

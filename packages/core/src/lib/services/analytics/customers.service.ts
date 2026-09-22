import { BaseService } from '../base.service.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsCustomer,
  AnalyticsCustomersStatsResponse,
  AnalyticsCustomersStatsQueryParams,
  AnalyticsCustomersListQueryParams,
} from '../../types/analytics/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce Analytics Customers Service
 *
 * Provides customer analytics through the WooCommerce Analytics API (wp-json/wc-analytics/reports/customers)
 */
export class AnalyticsCustomersService extends BaseService {
  private readonly endpoint = 'wp-json/wc-analytics/reports/customers';

  /**
   * List customer detail rows
   */
  list(
    params?: AnalyticsCustomersListQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AnalyticsCustomer[], AnalyticsCustomersListQueryParams> {
    const request = async (
      pageParams?: AnalyticsCustomersListQueryParams
    ): Promise<ApiPaginationResult<AnalyticsCustomer[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encodeValuesOnly: true })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await this.http.get<AnalyticsCustomer[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get customer statistics with time intervals
   */
  async getStats(
    params?: AnalyticsCustomersStatsQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AnalyticsCustomersStatsResponse>> {
    const query = params
      ? qs.stringify(params, { encodeValuesOnly: true })
      : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } =
      await this.http.get<AnalyticsCustomersStatsResponse>(url, options);
    return { data, error };
  }
}

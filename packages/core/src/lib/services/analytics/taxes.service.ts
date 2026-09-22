import { BaseService } from '../base.service.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AnalyticsTax,
  AnalyticsTaxesStatsResponse,
  AnalyticsTaxesStatsQueryParams,
  AnalyticsTaxesListQueryParams,
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
        ? qs.stringify(pageParams, { encodeValuesOnly: true })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await this.http.get<AnalyticsTax[]>(
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
  ): Promise<ApiResult<AnalyticsTaxesStatsResponse>> {
    const query = params
      ? qs.stringify(params, { encodeValuesOnly: true })
      : '';
    const url = `/${this.endpoint}/stats${query ? `?${query}` : ''}`;

    const { data, error } = await this.http.get<AnalyticsTaxesStatsResponse>(
      url,
      options
    );
    return { data, error };
  }
}
